const POSTGRES_ADMIN_APP_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_app_store.rs");
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
fn postgres_admin_app_writes_java_compatible_assigned_ids_explicitly() {
    for expected in [
        "const ASSIGNED_ID_FLOOR: i64 = 1_000_000_000_000;",
        "fn assigned_entity_id(namespace: &str, entity_uuid: &str, attempt: u8) -> i64",
        "SELECT COUNT(1) FROM plus_app WHERE id = $1",
        "INSERT INTO plus_app (id, uuid, tenant_id, organization_id",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "RETURNING id");
}

#[test]
fn postgres_admin_app_scopes_every_mutation_to_trusted_tenant_and_organization() {
    for expected in [
        "FROM plus_app WHERE id = $1 AND tenant_id = $2 AND organization_id = $3",
        "WHERE id = $22 AND tenant_id = $23 AND organization_id = $24",
        "WHERE id = $4 AND tenant_id = $5 AND organization_id = $6",
        "WHERE id = $1 AND tenant_id = $2 AND organization_id = $3",
        "DELETE FROM studio_catalog_asset",
        "DELETE FROM studio_catalog_artifact",
        "DELETE FROM studio_catalog_action",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
}

#[test]
fn postgres_admin_app_read_scope_matches_app_center_visible_catalog_scope() {
    for expected in [
        "const PUBLIC_APP_STORE_TENANT_ID: i64 = 20_001;",
        "OR ($2 > 0 AND organization_id = 0)",
        "OR (tenant_id = $3 AND organization_id = 0)",
        "WHEN tenant_id = $1 AND organization_id = $2 THEN 0",
        "WHEN tenant_id = $1 AND organization_id = 0 THEN 1",
        "WHEN tenant_id = $3 AND organization_id = 0 THEN 2",
        "OR ($3 > 0 AND organization_id = 0)",
        "OR (tenant_id = $4 AND organization_id = 0)",
        "WHEN tenant_id = $2 AND organization_id = $3 THEN 0",
        "WHEN tenant_id = $2 AND organization_id = 0 THEN 1",
        "WHEN tenant_id = $4 AND organization_id = 0 THEN 2",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
}

#[test]
fn postgres_admin_app_uses_jsonb_for_app_payloads_market_state_and_audit() {
    for expected in [
        "$7::jsonb",
        "$8::jsonb",
        "$14::jsonb",
        "$17::jsonb",
        "$18::jsonb",
        "$19::jsonb",
        "$20::jsonb",
        "$21::jsonb",
        "config -> 'standard' ->> 'appKey'",
        "config -> 'portal' ->> 'marketStatus'",
        "INSERT INTO ops_audit_log",
        "$10::jsonb",
        ".bind(APP_TARGET_TYPE)",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_APP_STORE, expected);
    }
}

#[test]
fn postgres_admin_app_matches_existing_plus_app_schema_without_new_columns() {
    let plus_app_table = POSTGRES_SCHEMA
        .split("CREATE TABLE IF NOT EXISTS plus_app")
        .nth(1)
        .unwrap()
        .split("CREATE INDEX IF NOT EXISTS idx_app_user_id")
        .next()
        .unwrap();
    assert_sql_contains(plus_app_table, "config JSONB NOT NULL DEFAULT '{}'::jsonb");
    assert_sql_contains(plus_app_table, "status INTEGER NOT NULL DEFAULT 1");
    assert_sql_not_contains(plus_app_table, "market_status");
    assert_sql_not_contains(plus_app_table, "app_key");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "plus_app.market_status");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "plus_app.app_key");
    assert_sql_contains(POSTGRES_ADMIN_APP_STORE, "DELETE FROM plus_app");
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
    assert_source_not_contains_exact(POSTGRES_ADMIN_APP_STORE, "\"published\"");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"ACTIVE\" => Ok(\"PUBLISHED\")");
    assert_sql_not_contains(POSTGRES_ADMIN_APP_STORE, "\"1\" => Ok(\"PUBLISHED\")");
}
