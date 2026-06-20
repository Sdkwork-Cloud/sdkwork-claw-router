const POSTGRES_APP_SKILLS: &str =
    include_str!("../src/infrastructure/sql/postgres/app_skills_read_store.rs");
const APP_CATALOG_MAPPING: &str = include_str!("../src/infrastructure/sql/app_catalog_mapping.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres app skills SQL must contain `{expected}`"
    );
}

#[test]
fn app_skills_sql_scopes_every_primary_query_by_trusted_subject() {
    for expected in [
        "s.tenant_id = $1",
        "s.organization_id = $2",
        "c.tenant_id = s.tenant_id",
        "c.organization_id = s.organization_id",
        "WHERE tenant_id = $1",
        "AND organization_id = $2",
    ] {
        assert_sql_contains(POSTGRES_APP_SKILLS, expected);
    }
}

#[test]
fn app_skills_sql_enforces_public_market_filter() {
    for expected in [
        "FROM ai_agent_skill s",
        "LEFT JOIN c_category c",
        "FROM ai_skill_asset",
        "FROM ai_skill_artifact",
        "COALESCE(s.enabled, false) = true",
        "upper(COALESCE(s.visibility, '')) = 'PUBLIC'",
        "upper(COALESCE(s.review_status, '')) = 'APPROVED'",
        "upper(COALESCE(s.market_status, '')) = 'PUBLISHED'",
        "c.type IN (19, 20)",
        "target_type = $3",
        "CATALOG_TARGET_TYPE_SKILL",
    ] {
        assert_sql_contains(POSTGRES_APP_SKILLS, expected);
    }
}

#[test]
fn app_skills_sql_does_not_project_internal_catalog_fields() {
    for forbidden in [
        "payload_hash",
        "client_ip_hash",
        "user_agent_hash",
        "metadata",
        "request_id",
        "trace_id",
        "review_comment",
        "reviewed_by",
    ] {
        assert!(
            !POSTGRES_APP_SKILLS.to_ascii_lowercase().contains(forbidden),
            "Postgres app skills must not project internal field `{forbidden}`"
        );
    }
}

#[test]
fn app_skills_sql_returns_contract_projection_fields() {
    for expected in [
        "AS id",
        "AS name",
        "AS provider",
        "AS description",
        "AS category_name",
        "AS icon_resource_snapshot",
        "AS cover_resource_snapshot",
        "AS rating_avg",
        "AS install_count",
        "AS capabilities",
        "AS default_config",
        "AS artifact_ref",
        "AS artifact_resource_snapshot",
        "AS artifact_size_bytes",
    ] {
        assert_sql_contains(POSTGRES_APP_SKILLS, expected);
    }

    assert!(
        !POSTGRES_APP_SKILLS.contains("AS artifact_url"),
        "Postgres app skills SQL must read canonical artifact_resource_snapshot instead of legacy artifact_url"
    );
}

#[test]
fn app_skills_sql_installs_runtime_default_config_without_portal_metadata() {
    for expected in [
        "SELECT s.id AS skill_id",
        "COALESCE(s.default_config::text, '{}') AS default_config",
        "default_config: string_cell(&row, \"default_config\")",
        "let config = merge_skill_install_config(&skill.default_config, command.config)?",
    ] {
        assert_sql_contains(POSTGRES_APP_SKILLS, expected);
    }

    for expected in [
        "runtime_default_config",
        "object.remove(\"portal\")",
        "merge_json_object",
    ] {
        assert_sql_contains(APP_CATALOG_MAPPING, expected);
    }
}
