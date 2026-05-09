const POSTGRES_ADMIN_SKILL_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_skill_store.rs");
const POSTGRES_SCHEMA: &str = include_str!("../../../generated/schema/postgres/schema.sql");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_sql_contains(sql: &str, expected: &str) {
    let actual = compact_sql(sql);
    let compact_expected = compact_sql(expected);
    assert!(
        actual.contains(&compact_expected),
        "Postgres admin skill SQL must contain `{expected}`"
    );
}

fn assert_sql_not_contains(sql: &str, forbidden: &str) {
    let actual = compact_sql(sql).to_ascii_lowercase();
    let compact_forbidden = compact_sql(forbidden).to_ascii_lowercase();
    assert!(
        !actual.contains(&compact_forbidden),
        "Postgres admin skill SQL must not contain `{forbidden}`"
    );
}

#[test]
fn postgres_admin_skill_writes_java_compatible_assigned_ids_explicitly() {
    for expected in [
        "const ASSIGNED_ID_FLOOR: i64 = 1_000_000_000_000;",
        "fn assigned_entity_id(namespace: &str, entity_uuid: &str, attempt: u8) -> i64",
        "SELECT COUNT(1) FROM plus_category WHERE id = $1",
        "SELECT COUNT(1) FROM plus_agent_skill WHERE id = $1",
        "SELECT COUNT(1) FROM plus_agent_skill_package WHERE id = $1",
        "INSERT INTO plus_category (id, uuid, tenant_id, organization_id",
        "INSERT INTO plus_agent_skill_package (id, uuid, tenant_id, organization_id",
        "INSERT INTO plus_agent_skill (id, uuid, tenant_id, organization_id",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "RETURNING id");
}

#[test]
fn postgres_admin_skill_scopes_every_mutation_to_trusted_tenant_and_organization() {
    for expected in [
        "FROM plus_category WHERE tenant_id = $1 AND organization_id = $2",
        "FROM plus_agent_skill_package WHERE tenant_id = $1 AND organization_id = $2",
        "FROM plus_agent_skill WHERE tenant_id = $1 AND organization_id = $2",
        "WHERE id = $1 AND tenant_id = $2 AND organization_id = $3",
        "WHERE id = $17 AND tenant_id = $18 AND organization_id = $19",
        "WHERE id = $47 AND tenant_id = $48 AND organization_id = $49",
        "WHERE id = $3 AND tenant_id = $4 AND organization_id = $5",
        "WHERE id = $5 AND tenant_id = $6 AND organization_id = $7",
        "WHERE id = $6 AND tenant_id = $7 AND organization_id = $8",
        "WHERE tenant_id = $1 AND organization_id = $2 AND skill_id = $3",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_uses_jsonb_for_skill_metadata_and_audit_payloads() {
    for expected in [
        "$35::jsonb",
        "$36::jsonb",
        "$37::jsonb",
        "$38::jsonb",
        "$16::jsonb",
        "tags = COALESCE($15::jsonb, tags)",
        "tags = COALESCE($42::jsonb, tags)",
        "capabilities = COALESCE($43::jsonb, capabilities)",
        "config_schema = COALESCE($44::jsonb, config_schema)",
        "default_config = COALESCE($45::jsonb, default_config)",
        "INSERT INTO ops_audit_log",
        "$10::jsonb",
        ".bind(SKILL_TARGET_TYPE)",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_matches_physical_schema_without_fake_soft_delete() {
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS plus_agent_skill",
    );
    assert_sql_contains(POSTGRES_SCHEMA, "CREATE TABLE IF NOT EXISTS plus_category");
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS plus_agent_skill_package",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS plus_user_agent_skill",
    );
    assert_sql_contains(POSTGRES_SCHEMA, "id BIGINT PRIMARY KEY");
    assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, "DELETE FROM plus_agent_skill");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "plus_agent_skill.deleted_at");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "s.deleted_at");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "deleted_at IS NULL");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "SET deleted_at");
}

#[test]
fn postgres_admin_skill_package_lifecycle_matches_java_table_contract() {
    for expected in [
        "INSERT INTO plus_agent_skill_package",
        "UPDATE plus_agent_skill_package",
        "DELETE FROM plus_agent_skill_package",
        "UPDATE plus_agent_skill SET package_id = NULL",
        "AND package_id = $4",
        "\"create_skill_package\"",
        "\"update_skill_package\"",
        "\"enable_skill_package\"",
        "\"disable_skill_package\"",
        "\"delete_skill_package\"",
        "SELECT COUNT(1) FROM plus_agent_skill_package WHERE id = $1 AND tenant_id = $2 AND organization_id = $3",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_assets_and_artifacts_use_catalog_projection_tables() {
    for expected in [
        "FROM studio_catalog_asset",
        "FROM studio_catalog_artifact",
        "INSERT INTO studio_catalog_asset",
        "INSERT INTO studio_catalog_artifact",
        "UPDATE studio_catalog_asset",
        "UPDATE studio_catalog_artifact",
        "DELETE FROM studio_catalog_asset",
        "DELETE FROM studio_catalog_artifact",
        "target_type = $3",
        ".bind(SKILL_TARGET_TYPE)",
        "SELECT COUNT(1) FROM studio_catalog_asset WHERE id = $1",
        "SELECT COUNT(1) FROM studio_catalog_artifact WHERE id = $1",
        "AND target_type = $3",
        "AND target_id = $4",
        "frameworks = COALESCE($14::jsonb, frameworks)",
        "$15::jsonb",
        "\"create_skill_asset\"",
        "\"update_skill_asset\"",
        "\"delete_skill_asset\"",
        "\"create_skill_artifact\"",
        "\"update_skill_artifact\"",
        "\"delete_skill_artifact\"",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_delete_removes_catalog_asset_and_artifact_orphans() {
    assert_sql_contains(
        POSTGRES_ADMIN_SKILL_STORE,
        "DELETE FROM studio_catalog_asset WHERE tenant_id = $1 AND organization_id = $2 AND target_type = $3 AND target_id = $4",
    );
    assert_sql_contains(
        POSTGRES_ADMIN_SKILL_STORE,
        "DELETE FROM studio_catalog_artifact WHERE tenant_id = $1 AND organization_id = $2 AND target_type = $3 AND target_id = $4",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS studio_catalog_asset",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS studio_catalog_artifact",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE INDEX IF NOT EXISTS idx_studio_catalog_asset_target",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE INDEX IF NOT EXISTS idx_studio_catalog_artifact_target",
    );
}
