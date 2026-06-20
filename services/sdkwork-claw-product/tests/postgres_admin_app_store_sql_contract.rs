const POSTGRES_ADMIN_APP_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_app_store.rs");
const APPSTORE_BASELINE: &str = include_str!(
    "../../../../sdkwork-appstore/database/ddl/baseline/postgres/0001_appstore_legacy_baseline.sql"
);
const POSTGRES_SCHEMA: &str = include_str!("../../../generated/schema/postgres/schema.sql");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres admin app SQL must contain `{expected}`"
    );
}

fn assert_sql_not_contains(sql: &str, forbidden: &str) {
    let actual = compact_sql(sql).to_ascii_lowercase();
    let compact_forbidden = compact_sql(forbidden).to_ascii_lowercase();
    assert!(
        !actual.contains(&compact_forbidden),
        "Postgres admin app SQL must not contain `{forbidden}`"
    );
}

fn assert_source_not_contains_exact(source: &str, forbidden: &str) {
    assert!(
        !source.contains(forbidden),
        "Postgres admin app source must not contain exact `{forbidden}`"
    );
}

#[test]
fn postgres_admin_app_writes_appbase_snowflake_ids_explicitly() {
    for expected in [
        "use crate::infrastructure::sql::runtime_id::next_admin_app_id;",
        "const MAX_RUNTIME_ID_ATTEMPTS: u8 = 16;",
        "let id = next_admin_app_id(\"admin-app\")?;",
        "SELECT COUNT(1) FROM appstore_app WHERE plus_app_id = $1",
        "INSERT INTO appstore_app (id, tenant_id, organization_id, publisher_id",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "ASSIGNED_ID_FLOOR");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "fn assigned_entity_id");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "RETURNING id");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "FROM platform_app WHERE");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "INSERT INTO platform_app (");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "UPDATE platform_app SET");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "DELETE FROM platform_app WHERE");
}

#[test]
fn postgres_admin_app_scopes_every_mutation_to_trusted_tenant_and_organization() {
    for expected in [
        "CAST(COALESCE(NULLIF(plus_app_id, ''), '0') AS BIGINT) = $1",
        "AND CAST(tenant_id AS BIGINT) = $2",
        "AND CAST(organization_id AS BIGINT) = $3",
        "DELETE FROM ai_skill_asset",
        "DELETE FROM ai_skill_artifact",
        "DELETE FROM ai_skill_action",
        "DELETE FROM appstore_app",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "DELETE FROM platform_app");
}

#[test]
fn postgres_admin_app_read_scope_matches_app_center_visible_catalog_scope() {
    for expected in [
        "const PUBLIC_APP_STORE_TENANT_ID: i64 = 20_001;",
        "OR ($2 > 0 AND CAST(organization_id AS BIGINT) = 0)",
        "OR (CAST(tenant_id AS BIGINT) = $3 AND CAST(organization_id AS BIGINT) = 0)",
        "WHEN CAST(tenant_id AS BIGINT) = $1 AND CAST(organization_id AS BIGINT) = $2 THEN 0",
        "WHEN CAST(tenant_id AS BIGINT) = $1 AND CAST(organization_id AS BIGINT) = 0 THEN 1",
        "WHEN CAST(tenant_id AS BIGINT) = $3 AND CAST(organization_id AS BIGINT) = 0 THEN 2",
        "FROM appstore_app",
        "display_name ILIKE",
        "COALESCE(runtime_status, 1)",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
}

#[test]
fn postgres_admin_app_uses_config_market_state_and_audit() {
    for expected in [
        "config -> 'standard' ->> 'appKey'",
        "config -> 'portal' ->> 'marketStatus'",
        "INSERT INTO ops_audit_log",
        ".bind(APP_TARGET_TYPE)",
        "runtime_status = $1",
        "app_status = $3",
        "distribution_status = $4",
        "review_status = $5",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
}

#[test]
fn postgres_admin_app_matches_canonical_appstore_and_media_resource_schema() {
    let appstore_app_table = APPSTORE_BASELINE
        .split("CREATE TABLE IF NOT EXISTS appstore_app")
        .nth(1)
        .unwrap()
        .split("CREATE TABLE IF NOT EXISTS appstore_app_dependency")
        .next()
        .unwrap();
    let c_category_table = POSTGRES_SCHEMA
        .split("CREATE TABLE IF NOT EXISTS c_category")
        .nth(1)
        .unwrap()
        .split("CREATE INDEX IF NOT EXISTS idx_category_shop_id")
        .next()
        .unwrap();
    let appstore_app_template_table = APPSTORE_BASELINE
        .split("CREATE TABLE IF NOT EXISTS appstore_app_template")
        .nth(1)
        .unwrap()
        .split("CREATE UNIQUE INDEX IF NOT EXISTS")
        .next()
        .unwrap();
    assert_sql_contains(appstore_app_table, "display_name TEXT NOT NULL");
    assert_sql_contains(appstore_app_table, "runtime_status INTEGER NOT NULL DEFAULT 1");
    assert_sql_contains(appstore_app_table, "icon_media_id TEXT");
    assert_sql_contains(appstore_app_table, "icon_resource_snapshot TEXT");
    assert_sql_contains(appstore_app_table, "artifact_resource_snapshot TEXT");
    assert_sql_contains(appstore_app_table, "plus_app_id TEXT");
    assert_sql_not_contains(appstore_app_table, "icon_url");
    assert_sql_not_contains(appstore_app_table, "download_url");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "download_url");
    assert_sql_contains(c_category_table, "icon_media_resource_id VARCHAR(128)");
    assert_sql_contains(c_category_table, "icon_object_blob_id BIGINT");
    assert_sql_contains(c_category_table, "icon_resource_snapshot JSONB");
    assert_sql_not_contains(c_category_table, "icon TEXT");
    assert_sql_contains(
        appstore_app_template_table,
        "icon_media_resource_id VARCHAR(128)",
    );
    assert_sql_contains(appstore_app_template_table, "icon_object_blob_id BIGINT");
    assert_sql_contains(appstore_app_template_table, "icon_resource_snapshot JSONB");
    assert_sql_contains(
        appstore_app_template_table,
        "cover_media_resource_id VARCHAR(128)",
    );
    assert_sql_contains(appstore_app_template_table, "cover_object_blob_id BIGINT");
    assert_sql_contains(appstore_app_template_table, "cover_resource_snapshot JSONB");
    assert_sql_not_contains(appstore_app_template_table, "icon_url");
    assert_sql_not_contains(appstore_app_template_table, "cover_url");
    assert_sql_not_contains(appstore_app_table, "market_status");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "FROM platform_app WHERE");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "INSERT INTO platform_app (");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "platform_app_template");
    assert_sql_contains(POSTGRES_ADMIN_APP_STORE, "FROM appstore_app_template");
}

#[test]
fn postgres_admin_app_does_not_treat_market_state_as_runtime_status_alias() {
    assert_sql_contains(POSTGRES_ADMIN_APP_STORE, "\"ACTIVE\" => Ok(1)");
    assert_sql_contains(POSTGRES_ADMIN_APP_STORE, "\"INACTIVE\" => Ok(0)");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"ENABLED\"");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"DISABLED\"");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"1\" => Ok(1)");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"0\" => Ok(0)");
    assert_sql_not_contains(
        POSTGRES_ADMIN_APP_STORE,
        "\"ACTIVE\" | \"ENABLED\" | \"PUBLISHED\"",
    );
    assert_sql_not_contains(
        POSTGRES_ADMIN_APP_STORE,
        "\"INACTIVE\" | \"DISABLED\" | \"OFFLINE\"",
    );
    assert_sql_contains(
        POSTGRES_ADMIN_APP_STORE,
        "app status must be ACTIVE or INACTIVE",
    );
}

#[test]
fn postgres_admin_app_validates_market_status_as_precise_store_enum() {
    assert_sql_contains(
        POSTGRES_ADMIN_APP_STORE,
        "fn app_market_status(value: &str)",
    );
    assert_sql_contains(POSTGRES_ADMIN_APP_STORE, "\"DRAFT\" => Ok(\"DRAFT\")");
    assert_sql_contains(
        POSTGRES_ADMIN_APP_STORE,
        "\"PUBLISHED\" => Ok(\"PUBLISHED\")",
    );
    assert_sql_contains(POSTGRES_ADMIN_APP_STORE, "\"OFFLINE\" => Ok(\"OFFLINE\")");
    assert_sql_contains(
        POSTGRES_ADMIN_APP_STORE,
        "app marketStatus must be DRAFT, PUBLISHED, or OFFLINE",
    );
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "to_ascii_uppercase().as_str()");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"ACTIVE\" => Ok(\"PUBLISHED\")");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"1\" => Ok(\"PUBLISHED\")");
}
