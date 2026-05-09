const POSTGRES_APP_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/app_store_read_store.rs");

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
        "FROM plus_app a",
        "FROM studio_catalog_action sa",
        "FROM studio_catalog_asset",
        "FROM studio_catalog_artifact",
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
        "LIMIT $9 OFFSET $10",
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
        "Postgres app store status mapper must keep plus_app.status separate from portal marketStatus"
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
        "AS icon_url",
        "AS app_type",
        "AS rating",
        "AS download_count",
        "AS asset_url",
        "AS artifact_url",
        "AS artifact_size_bytes",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
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
fn app_store_categories_sql_scans_complete_public_app_set() {
    for expected in [
        "const LOAD_CATEGORIES",
        "FROM plus_app a",
        "a.tenant_id = $1",
        "a.organization_id = $2",
        "OR ($2 > 0 AND a.organization_id = 0)",
        "COALESCE(a.status, 1) = 1",
        "COALESCE(NULLIF(a.config -> 'portal' ->> 'marketStatus', ''), NULLIF(a.config ->> 'marketStatus', ''), 'DRAFT') = 'PUBLISHED'",
        "COALESCE(a.config::text, '') AS config",
        "COALESCE(CAST(a.app_type AS TEXT), '') AS app_type",
        "COALESCE(a.install_config::text, '') AS install_config",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }

    assert!(
        !compact_sql(POSTGRES_APP_STORE).contains("load_apps(AppStoreQuery::default()"),
        "categories must not be derived from the default paged app catalog list"
    );
}
