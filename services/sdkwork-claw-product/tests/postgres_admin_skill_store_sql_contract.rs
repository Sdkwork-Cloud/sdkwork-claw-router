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
fn postgres_admin_skill_writes_appbase_snowflake_ids_explicitly() {
    for expected in [
        "use crate::infrastructure::sql::runtime_id::{next_admin_skill_id, next_claw_runtime_id};",
        "const MAX_RUNTIME_ID_ATTEMPTS: u8 = 16;",
        "let id = next_admin_skill_id(namespace)?;",
        "SELECT COUNT(1) FROM c_category WHERE id = $1",
        "SELECT COUNT(1) FROM ai_agent_skill WHERE id = $1",
        "SELECT COUNT(1) FROM ai_agent_skill_package WHERE id = $1",
        "INSERT INTO c_category (id, uuid, tenant_id, organization_id",
        "INSERT INTO ai_agent_skill_package (id, uuid, tenant_id, organization_id",
        "INSERT INTO ai_agent_skill (id, uuid, tenant_id, organization_id",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "ASSIGNED_ID_FLOOR");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "fn assigned_entity_id");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "RETURNING id");
}

#[test]
fn postgres_admin_skill_scopes_every_mutation_to_trusted_tenant_and_organization() {
    for expected in [
        "FROM c_category WHERE tenant_id = $1 AND organization_id = $2",
        "FROM ai_agent_skill_package WHERE tenant_id = $1 AND organization_id = $2",
        "FROM ai_agent_skill WHERE tenant_id = $1 AND organization_id = $2",
        "WHERE id = $1 AND tenant_id = $2 AND organization_id = $3",
        "WHERE id = $21 AND tenant_id = $22 AND organization_id = $23",
        "WHERE id = $55 AND tenant_id = $56 AND organization_id = $57",
        "WHERE id = $3 AND tenant_id = $4 AND organization_id = $5",
        "WHERE id = $5 AND tenant_id = $6 AND organization_id = $7",
        "WHERE id = $6 AND tenant_id = $7 AND organization_id = $8",
        "WHERE tenant_id = $1 AND organization_id = $2 AND skill_id = $3",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_read_scope_matches_skill_store_visible_catalog_scope() {
    for expected in [
        "const PUBLIC_SKILLS_TENANT_ID: i64 = 0;",
        "const PUBLIC_SKILLS_ORGANIZATION_ID: i64 = 0;",
        "(tenant_id = $1 AND organization_id = $2) OR (tenant_id = $3 AND organization_id = $4)",
        "WHEN tenant_id = $1 AND organization_id = $2 THEN 0",
        "WHEN tenant_id = $3 AND organization_id = $4 THEN 1",
        "AND ($5::text IS NULL OR name ILIKE $6 ESCAPE '\\' OR package_key ILIKE $7 ESCAPE '\\')",
        "AND ($16::bigint IS NULL OR category_id = $17)",
        "LIMIT $18 OFFSET $19",
        "AND target_type = $5 AND target_id = $6",
        "FROM ai_agent_skill WHERE id = $1 AND ( (tenant_id = $2 AND organization_id = $3) OR (tenant_id = $4 AND organization_id = $5) )",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_uses_jsonb_for_skill_metadata_and_audit_payloads() {
    for expected in [
        "$39::jsonb",
        "$40::jsonb",
        "$41::jsonb",
        "$42::jsonb",
        "$12::jsonb",
        "$15::jsonb",
        "icon_resource_snapshot = CASE WHEN $10 THEN $11::jsonb ELSE icon_resource_snapshot END",
        "cover_resource_snapshot = CASE WHEN $16 THEN $17::jsonb ELSE cover_resource_snapshot END",
        "tags = COALESCE($23::jsonb, tags)",
        "tags = COALESCE($50::jsonb, tags)",
        "capabilities = COALESCE($51::jsonb, capabilities)",
        "config_schema = COALESCE($52::jsonb, config_schema)",
        "default_config = COALESCE($53::jsonb, default_config)",
        "INSERT INTO ops_audit_log",
        "INSERT INTO ops_audit_log (id, uuid, tenant_id, organization_id",
        "next_claw_runtime_id(\"ops_audit_log\")",
        "$11::jsonb",
        ".bind(SKILL_TARGET_TYPE)",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_matches_physical_schema_without_fake_soft_delete() {
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS ai_agent_skill",
    );
    assert_sql_contains(POSTGRES_SCHEMA, "CREATE TABLE IF NOT EXISTS c_category");
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS ai_agent_skill_package",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS ai_user_agent_skill",
    );
    assert_sql_contains(POSTGRES_SCHEMA, "id BIGINT NOT NULL PRIMARY KEY");
    assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, "DELETE FROM ai_agent_skill");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "ai_agent_skill.deleted_at");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "s.deleted_at");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "deleted_at IS NULL");
    assert_sql_not_contains(POSTGRES_ADMIN_SKILL_STORE, "SET deleted_at");
}

#[test]
fn postgres_admin_skill_package_lifecycle_matches_java_table_contract() {
    for expected in [
        "INSERT INTO ai_agent_skill_package",
        "UPDATE ai_agent_skill_package",
        "DELETE FROM ai_agent_skill_package",
        "UPDATE ai_agent_skill SET package_id = NULL",
        "AND package_id = $4",
        "\"create_skill_package\"",
        "\"update_skill_package\"",
        "\"enable_skill_package\"",
        "\"disable_skill_package\"",
        "\"delete_skill_package\"",
        "SELECT COUNT(1) FROM ai_agent_skill_package WHERE id = $1 AND tenant_id = $2 AND organization_id = $3",
    ] {
        assert_sql_contains(POSTGRES_ADMIN_SKILL_STORE, expected);
    }
}

#[test]
fn postgres_admin_skill_assets_and_artifacts_use_catalog_projection_tables() {
    for expected in [
        "FROM ai_skill_asset",
        "FROM ai_skill_artifact",
        "INSERT INTO ai_skill_asset",
        "INSERT INTO ai_skill_artifact",
        "UPDATE ai_skill_asset",
        "UPDATE ai_skill_artifact",
        "DELETE FROM ai_skill_asset",
        "DELETE FROM ai_skill_artifact",
        "target_type = $3",
        ".bind(SKILL_TARGET_TYPE)",
        "SELECT COUNT(1) FROM ai_skill_asset WHERE id = $1",
        "SELECT COUNT(1) FROM ai_skill_artifact WHERE id = $1",
        "AND target_type = $3",
        "AND target_id = $4",
        "frameworks = COALESCE($18::jsonb, frameworks)",
        "$17::jsonb",
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
        "DELETE FROM ai_skill_asset WHERE tenant_id = $1 AND organization_id = $2 AND target_type = $3 AND target_id = $4",
    );
    assert_sql_contains(
        POSTGRES_ADMIN_SKILL_STORE,
        "DELETE FROM ai_skill_artifact WHERE tenant_id = $1 AND organization_id = $2 AND target_type = $3 AND target_id = $4",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS ai_skill_asset",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE TABLE IF NOT EXISTS ai_skill_artifact",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE INDEX IF NOT EXISTS idx_ai_skill_asset_target",
    );
    assert_sql_contains(
        POSTGRES_SCHEMA,
        "CREATE INDEX IF NOT EXISTS idx_ai_skill_artifact_target",
    );
}
