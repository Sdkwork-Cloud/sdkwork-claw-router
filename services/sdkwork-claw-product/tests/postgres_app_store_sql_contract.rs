const POSTGRES_APP_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_store_read_store.rs");
const APP_CATALOG_MAPPING: &str = include_str!("../src/infrastructure/sql/app_catalog_mapping.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres app store SQL must contain `{expected}`"
    );
}

#[test]
fn app_store_sql_scopes_every_primary_query_by_trusted_subject() {
    for expected in [
        "a.tenant_id = $1",
        "a.organization_id = $2",
        "OR ($2 > 0 AND a.organization_id = 0)",
        "sa.tenant_id = a.tenant_id",
        "sa.organization_id = a.organization_id",
        "WHERE tenant_id = $1",
        "AND organization_id = $2",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }
}

#[test]
fn app_store_sql_reads_existing_market_tables_and_filters_active_apps() {
    for expected in [
        "FROM platform_app a",
        "FROM ai_skill_action sa",
        "FROM ai_skill_asset",
        "FROM ai_skill_artifact",
        "COALESCE(a.status, 1) = 1",
        "COALESCE(NULLIF(a.config -> 'portal' ->> 'marketStatus', ''), NULLIF(a.config ->> 'marketStatus', ''), 'DRAFT') = 'PUBLISHED'",
        "$3::integer IS NULL OR COALESCE(a.status, 1) = $4",
        "$5::text IS NULL OR COALESCE(a.updated_at, a.created_at) >= $6::timestamp",
        "$7::text IS NULL OR COALESCE(a.updated_at, a.created_at) <= $8::timestamp",
        "target_type = 15",
        "CATALOG_TARGET_TYPE_APP",
        "const LOAD_APPS_BASE",
        "const LOAD_APPS_PAGED_SUFFIX",
        "const LOAD_APPS_UNPAGED_SUFFIX",
        "LIMIT $10 OFFSET $11",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }
    assert!(
        !POSTGRES_APP_STORE.contains("LIKE $10 ESCAPE"),
        "Postgres app store keyword filtering must use DTO semantics before pagination instead of a wider raw SQL LIKE page"
    );

    assert!(
        !POSTGRES_APP_STORE.contains("\"PUBLISHED\" | \"1\"")
            && !POSTGRES_APP_STORE.contains("\"PUBLISHED\" | '1'")
            && !POSTGRES_APP_STORE.contains("\"ACTIVE\" | \"ENABLED\" | \"PUBLISHED\"")
            && !POSTGRES_APP_STORE.contains("\"ACTIVE\" | \"ENABLED\" | \"1\""),
        "Postgres app store status mapper must keep platform_app.status separate from portal marketStatus"
    );
}

#[test]
fn app_store_sql_does_not_project_internal_catalog_fields() {
    for forbidden in [
        "payload_hash",
        "client_ip_hash",
        "user_agent_hash",
        "metadata",
        "request_id",
        "trace_id",
    ] {
        assert!(
            !POSTGRES_APP_STORE.to_ascii_lowercase().contains(forbidden),
            "Postgres app store must not project internal field `{forbidden}`"
        );
    }
}

#[test]
fn app_store_sql_returns_contract_projection_fields() {
    for expected in [
        "AS id",
        "AS name",
        "AS description",
        "AS icon_resource_snapshot",
        "AS app_type",
        "AS rating",
        "AS download_count",
        "AS asset_resource_snapshot",
        "AS thumbnail_resource_snapshot",
        "AS artifact_resource_snapshot",
        "AS artifact_size_bytes",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }

    assert!(
        !POSTGRES_APP_STORE.contains("AS artifact_url"),
        "Postgres app store SQL must read canonical artifact_resource_snapshot instead of legacy artifact_url"
    );
    assert!(
        !POSTGRES_APP_STORE.contains("download_url"),
        "Postgres app store SQL must not read platform_app.download_url; app artifacts must be MediaResource objects from artifact_resource_snapshot"
    );
}

#[test]
fn app_catalog_mapping_does_not_fallback_to_legacy_media_url_fields() {
    for forbidden in ["artifactUrl", "\"assetUrl\"", "download_url"] {
        assert!(
            !APP_CATALOG_MAPPING.contains(forbidden),
            "App catalog mapping must not fallback to legacy media field `{forbidden}`"
        );
    }
}

#[test]
fn app_store_detail_sql_accepts_numeric_id_or_stable_app_key() {
    for expected in [
        "CAST(a.id AS TEXT) = $3",
        "a.config -> 'standard' ->> 'appKey' = $3",
        "OR ($2 > 0 AND a.organization_id = 0)",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }
}

#[test]
fn app_store_categories_sql_reads_unified_c_category_app_store_tree() {
    for expected in [
        "const LOAD_CATEGORIES",
        "FROM c_category c",
        "c.tenant_id = $1",
        "c.organization_id = $2",
        "OR (c.tenant_id = $3 AND c.organization_id = 0)",
        "c.type = 999999",
        "c.group_name = 'app-store'",
        "COALESCE(c.visible, true) = true",
        "COALESCE(c.status, 1) = 1",
        "ORDER BY COALESCE(c.sort_weight, 0), c.id",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }

    assert!(
        !compact_sql(POSTGRES_APP_STORE).contains("app_category_from_raw("),
        "categories must not be derived from platform_app.app_type or app DTO config"
    );
}
