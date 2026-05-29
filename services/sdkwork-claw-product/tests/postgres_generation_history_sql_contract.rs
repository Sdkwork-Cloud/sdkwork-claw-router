const POSTGRES_GENERATION_HISTORY_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_generation_history_read_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres generation history SQL must contain `{expected}`"
    );
}

#[test]
fn generation_history_sql_exposes_all_supported_visible_statuses() {
    for expected in [
        "a.status IN (0, 1, 2, 3, 4)",
        "j.status IN (0, 1, 2, 3, 4)",
        "a.status AS status_code",
        "j.status AS status_code",
        "status_label(required_integer_cell(&row, \"status_code\", \"status\")?)?",
        "0 => Ok(\"pending\")",
        "1 => Ok(\"completed\")",
        "2 => Ok(\"processing\")",
        "3 => Ok(\"failed\")",
        "4 => Ok(\"cancelled\")",
        "invalid generation history status from database row",
    ] {
        assert_sql_contains(POSTGRES_GENERATION_HISTORY_STORE, expected);
    }
    assert!(
        !POSTGRES_GENERATION_HISTORY_STORE.contains("_ => \"pending\""),
        "Postgres generation history mapper must not invent pending rows for unknown statuses"
    );
    assert!(
        !POSTGRES_GENERATION_HISTORY_STORE.contains("COALESCE(j.status, 0) AS status_code"),
        "Postgres generation history must not default missing job statuses to pending"
    );
    assert!(
        !POSTGRES_GENERATION_HISTORY_STORE
            .contains("COALESCE(a.status, j.status, 0) AS status_code"),
        "Postgres generation history must not merge asset and job statuses with a pending default"
    );
}

#[test]
fn generation_history_sql_rejects_unknown_item_types_before_mapping() {
    for expected in [
        "a.asset_type IN (2, 3, 4, 5, 6)",
        "j.modality IN (2, 3, 4, 5, 6)",
        "rows.into_iter().map(row_to_history_item).collect()",
        "a.asset_type AS item_kind",
        "j.modality AS item_kind",
        "item_type_label(required_integer_cell(&row, \"item_kind\", \"item kind\")?)?",
        "1 => Ok(\"text\")",
        "2 => Ok(\"image\")",
        "3 => Ok(\"video\")",
        "4 => Ok(\"audio\")",
        "5 => Ok(\"music\")",
        "6 => Ok(\"sfx\")",
        "invalid generation history item kind from database row",
    ] {
        assert_sql_contains(POSTGRES_GENERATION_HISTORY_STORE, expected);
    }
    assert!(
        !POSTGRES_GENERATION_HISTORY_STORE.contains("_ => \"audio\""),
        "Postgres generation history mapper must not invent audio rows for unknown item types"
    );
    assert!(
        !POSTGRES_GENERATION_HISTORY_STORE.contains("filter_map(row_to_history_item)"),
        "Postgres generation history mapper must fail closed instead of silently dropping invalid rows"
    );
    assert!(
        !POSTGRES_GENERATION_HISTORY_STORE.contains("COALESCE(j.modality, j.job_type, 0)"),
        "Postgres generation history must not default missing item kind to an invalid sentinel"
    );
    assert!(
        !POSTGRES_GENERATION_HISTORY_STORE.contains("COALESCE(j.modality, j.job_type)"),
        "Postgres generation history must not infer missing modality from job_type"
    );
}

#[test]
fn generation_history_sql_scopes_and_deduplicates_rows_by_trusted_subject() {
    for expected in [
        "a.tenant_id = $1",
        "a.organization_id = $2",
        "a.user_id = $3",
        "j.tenant_id = $1",
        "j.organization_id = $2",
        "j.user_id = $3",
        "r.tenant_id = $1",
        "r.organization_id = $2",
        "r.user_id = $3",
        "r.source_surface = 'playground'",
        "ai_agent_run r",
        "ai_runtime_invocation i",
        "ai_runtime_artifact ar",
        "AND NOT EXISTS (",
        "a.job_id = j.id",
        "a.deleted_at IS NULL",
    ] {
        assert_sql_contains(POSTGRES_GENERATION_HISTORY_STORE, expected);
    }
}

#[test]
fn generation_history_sql_orders_newest_first_and_caps_history_size() {
    for expected in [
        "ORDER BY sort_updated_at DESC NULLS LAST, id DESC",
        "LIMIT 100",
        "COALESCE(a.updated_at, j.completed_at, j.created_at) AS sort_updated_at",
    ] {
        assert_sql_contains(POSTGRES_GENERATION_HISTORY_STORE, expected);
    }
}

#[test]
fn generation_history_sql_formats_public_timestamps_as_rfc3339_utc() {
    for expected in [
        "to_char((COALESCE(a.created_at, j.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') AS created_at",
        "to_char((COALESCE(a.updated_at, j.completed_at, j.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') AS updated_at",
        "to_char((r.created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') AS created_at",
        "to_char((COALESCE(r.completed_at, i.completed_at, r.created_at) AT TIME ZONE 'UTC'), 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') AS updated_at",
        "date: history_date(&created_at)",
        "created_at: optional_string(created_at)",
        "updated_at: optional_string(updated_at)",
    ] {
        assert_sql_contains(POSTGRES_GENERATION_HISTORY_STORE, expected);
    }
}

#[test]
fn generation_history_sql_projects_standard_agent_runtime_generation_fields() {
    for expected in [
        "request_json ->> 'targetType'",
        "request_json #>> '{generationConfig,aspectRatio}'",
        "request_json #>> '{generationConfig,durationSeconds}'",
        "response_json ->> 'outputText'",
        "COALESCE(NULLIF(r.output_message, ''), NULLIF(i.response_json ->> 'outputText', ''), '') AS output_text",
        "WHEN target_modality IN (1, 2, 3, 4, 5, 6) THEN target_modality",
        "WHEN target_signal IN ('text', 'llm', 'chat', 'agent') OR target_signal LIKE '%text%' THEN 1",
        "WHEN NULLIF(output_text, '') IS NOT NULL THEN 1",
        "WHERE item_kind IN (1, 2, 3, 4, 5, 6)",
        "model_catalog_key: optional_string(string_cell(&row, \"model_catalog_key\"))",
        "aspect_ratio: optional_string(string_cell(&row, \"aspect_ratio\"))",
        "duration_seconds: optional_integer_cell(&row, \"duration_seconds\")",
        "output_text: optional_string(string_cell(&row, \"output_text\"))",
    ] {
        assert_sql_contains(POSTGRES_GENERATION_HISTORY_STORE, expected);
    }
}

#[test]
fn generation_history_sql_does_not_project_internal_sensitive_fields() {
    for forbidden in [
        "storage_key",
        "payload_hash",
        "trace_id",
        "client_ip_hash",
        "user_agent_hash",
        "provider_error",
    ] {
        assert!(
            !POSTGRES_GENERATION_HISTORY_STORE
                .to_ascii_lowercase()
                .contains(forbidden),
            "Postgres generation history must not project internal field `{forbidden}`"
        );
    }
}
