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
        "CAST(a.tenant_id AS BIGINT) = $1",
        "CAST(a.organization_id AS BIGINT) = $2",
        "OR ($2 > 0 AND CAST(a.organization_id AS BIGINT) = 0)",
        "cat.tenant_id = CAST($1 AS TEXT)",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }
}

#[test]
fn app_store_sql_reads_appstore_app_directly_and_filters_active_apps() {
    for expected in [
        "FROM appstore_app a",
        "a.app_status = 'published'",
        "a.distribution_status = 'listed'",
        "COALESCE(NULLIF(a.rating_avg, ''), '0')::float8 AS rating",
        "COALESCE(a.download_count, 0) AS download_count",
        "COALESCE(a.runtime_status, 1) = 1",
        "COALESCE(NULLIF(a.config::jsonb -> 'portal' ->> 'marketStatus', ''), NULLIF(a.config::jsonb ->> 'marketStatus', ''), 'DRAFT') = 'PUBLISHED'",
        "$3::integer IS NULL OR COALESCE(a.runtime_status, 1) = $4",
        "$5::text IS NULL OR COALESCE(a.updated_at, a.created_at) >= $6::timestamp",
        "$7::text IS NULL OR COALESCE(a.updated_at, a.created_at) <= $8::timestamp",
        "const LOAD_APPS_BASE",
        "const LOAD_APPS_PAGED_SUFFIX",
        "const LOAD_APPS_UNPAGED_SUFFIX",
        "LIMIT $10 OFFSET $11",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }
    assert!(
        !POSTGRES_APP_STORE.contains("platform_app"),
        "Postgres app store must not read legacy platform_app"
    );
    assert!(
        !POSTGRES_APP_STORE.contains("FROM ai_skill_action"),
        "Postgres app store must not aggregate downloads/ratings from ai_skill_action; use appstore_app columns"
    );
    assert!(
        !POSTGRES_APP_STORE.contains("LIKE $10 ESCAPE"),
        "Postgres app store keyword filtering must use DTO semantics before pagination instead of a wider raw SQL LIKE page"
    );

    assert!(
        !POSTGRES_APP_STORE.contains("\"PUBLISHED\" | \"1\"")
            && !POSTGRES_APP_STORE.contains("\"PUBLISHED\" | '1'")
            && !POSTGRES_APP_STORE.contains("\"ACTIVE\" | \"ENABLED\" | \"PUBLISHED\"")
            && !POSTGRES_APP_STORE.contains("\"ACTIVE\" | \"ENABLED\" | \"1\""),
        "Postgres app store status mapper must keep runtime_status separate from portal marketStatus"
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
        "AS artifact_resource_snapshot",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }

    assert!(
        !POSTGRES_APP_STORE.contains("AS artifact_url"),
        "Postgres app store SQL must read canonical artifact_resource_snapshot instead of legacy artifact_url"
    );
    assert!(
        !POSTGRES_APP_STORE.contains("download_url"),
        "Postgres app store SQL must not read legacy download_url; app artifacts must be MediaResource objects from artifact_resource_snapshot"
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
        "COALESCE(NULLIF(a.plus_app_id, ''), a.id) = $3",
        "a.config::jsonb -> 'standard' ->> 'appKey' = $3",
        "OR ($2 > 0 AND CAST(a.organization_id AS BIGINT) = 0)",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }
}

#[test]
fn app_store_categories_sql_reads_appstore_category_localizations() {
    for expected in [
        "const LOAD_CATEGORIES",
        "FROM appstore_category cat",
        "appstore_category_localization loc",
        "cat.category_status = 'active'",
        "ORDER BY COALESCE(cat.sort_order, 0), cat.id",
    ] {
        assert_sql_contains(POSTGRES_APP_STORE, expected);
    }

    assert!(
        !compact_sql(POSTGRES_APP_STORE).contains("c.category_type = 'app_store'"),
        "categories must read canonical appstore_category rows instead of legacy c_category app_store projections"
    );
    assert!(
        !compact_sql(POSTGRES_APP_STORE).contains("app_category_from_raw("),
        "categories must not be derived from legacy app_type or app DTO config"
    );
}
