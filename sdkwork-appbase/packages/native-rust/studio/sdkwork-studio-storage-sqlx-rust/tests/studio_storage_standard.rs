use sdkwork_studio_storage_sqlx::{
    studio_app_template_tables, studio_database_tables, studio_initial_migration_sql,
    studio_mcp_tables, studio_prompt_tables, studio_shared_catalog_tables,
    studio_storage_capability_manifest, STUDIO_TARGET_TYPE_APP, STUDIO_TARGET_TYPE_APP_TEMPLATE,
    STUDIO_TARGET_TYPE_MCP_SERVER, STUDIO_TARGET_TYPE_MCP_TOOL, STUDIO_TARGET_TYPE_PROMPT,
};

#[test]
fn exposes_studio_app_template_table_catalog() {
    let tables = studio_database_tables();

    assert_eq!(STUDIO_TARGET_TYPE_APP, 15);
    assert_eq!(STUDIO_TARGET_TYPE_APP_TEMPLATE, 16);
    assert_eq!(STUDIO_TARGET_TYPE_PROMPT, 17);
    assert_eq!(STUDIO_TARGET_TYPE_MCP_SERVER, 18);
    assert_eq!(STUDIO_TARGET_TYPE_MCP_TOOL, 19);

    for table in [
        "studio_catalog_action",
        "studio_catalog_asset",
        "studio_catalog_artifact",
        "studio_app_template",
        "studio_app_template_version",
        "studio_app_template_usage",
        "studio_prompt",
        "studio_prompt_version",
        "studio_prompt_binding",
        "studio_mcp_server",
        "studio_mcp_server_revision",
        "studio_mcp_tool",
        "studio_mcp_binding",
    ] {
        assert!(tables.contains(&table), "missing studio table: {table}");
    }

    for table in tables {
        assert!(
            table.starts_with("studio_"),
            "studio storage must only expose studio-prefixed tables: {table}",
        );
        assert!(
            !table.starts_with("plus_"),
            "appbase studio storage must not add legacy plus-prefixed tables: {table}",
        );
        assert_ne!(table, "app_template");
        assert_ne!(table, "application_template");
        assert_ne!(table, "plus_app_template");
        assert_ne!(table, "studio_prompt_category");
        assert_ne!(table, "studio_mcp_category");
    }
}

#[test]
fn splits_shared_catalog_tables_from_template_tables() {
    assert_eq!(
        studio_shared_catalog_tables(),
        vec![
            "studio_catalog_action",
            "studio_catalog_asset",
            "studio_catalog_artifact",
        ],
    );

    assert_eq!(
        studio_app_template_tables(),
        vec![
            "studio_app_template",
            "studio_app_template_version",
            "studio_app_template_usage",
        ],
    );

    assert_eq!(
        studio_prompt_tables(),
        vec![
            "studio_prompt",
            "studio_prompt_version",
            "studio_prompt_binding",
        ],
    );

    assert_eq!(
        studio_mcp_tables(),
        vec![
            "studio_mcp_server",
            "studio_mcp_server_revision",
            "studio_mcp_tool",
            "studio_mcp_binding",
        ],
    );
}

#[test]
fn initial_migration_declares_catalog_and_template_tables() {
    let sql = studio_initial_migration_sql();

    for expected in [
        "CREATE TABLE IF NOT EXISTS studio_catalog_action",
        "CREATE TABLE IF NOT EXISTS studio_catalog_asset",
        "CREATE TABLE IF NOT EXISTS studio_catalog_artifact",
        "CREATE TABLE IF NOT EXISTS studio_app_template",
        "CREATE TABLE IF NOT EXISTS studio_app_template_version",
        "CREATE TABLE IF NOT EXISTS studio_app_template_usage",
        "target_type INTEGER",
        "template_no VARCHAR(64) NOT NULL",
        "template_code VARCHAR(128) NOT NULL",
        "git_repo_url VARCHAR(1024)",
        "git_ref VARCHAR(128)",
        "git_sub_path VARCHAR(1024)",
        "publish_status INTEGER NOT NULL DEFAULT 1",
        "visibility INTEGER NOT NULL DEFAULT 1",
        "app_config_schema JSONB NOT NULL DEFAULT '{}'::jsonb",
        "default_app_config JSONB NOT NULL DEFAULT '{}'::jsonb",
        "variable_schema JSONB NOT NULL DEFAULT '{}'::jsonb",
        "file_manifest JSONB NOT NULL DEFAULT '[]'::jsonb",
        "dependency_manifest JSONB NOT NULL DEFAULT '[]'::jsonb",
        "capability_manifest JSONB NOT NULL DEFAULT '[]'::jsonb",
        "input_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb",
        "output_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb",
    ] {
        assert!(
            sql.contains(expected),
            "studio migration must contain `{expected}`",
        );
    }
}

#[test]
fn prompt_tables_are_vertical_and_reuse_unified_category() {
    let sql = studio_initial_migration_sql();

    for expected in [
        "CREATE TABLE IF NOT EXISTS studio_prompt",
        "CREATE TABLE IF NOT EXISTS studio_prompt_version",
        "CREATE TABLE IF NOT EXISTS studio_prompt_binding",
        "prompt_key VARCHAR(128) NOT NULL",
        "prompt_type VARCHAR(64) NOT NULL",
        "category_id BIGINT",
        "current_version_id BIGINT",
        "variable_schema JSONB NOT NULL DEFAULT '{}'::jsonb",
        "output_schema JSONB NOT NULL DEFAULT '{}'::jsonb",
        "model_constraints JSONB NOT NULL DEFAULT '{}'::jsonb",
        "safety_policy JSONB NOT NULL DEFAULT '{}'::jsonb",
        "snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb",
        "CONSTRAINT uk_studio_prompt_key",
        "CONSTRAINT uk_studio_prompt_version_no",
        "CREATE INDEX IF NOT EXISTS idx_studio_prompt_category",
        "CREATE INDEX IF NOT EXISTS idx_studio_prompt_binding_owner",
    ] {
        assert!(
            sql.contains(expected),
            "studio prompt migration must contain `{expected}`",
        );
    }

    assert!(
        !sql.contains("CREATE TABLE IF NOT EXISTS studio_prompt_category"),
        "prompt must reuse the unified Category model through category_id",
    );
}

#[test]
fn mcp_tables_are_vertical_and_reuse_unified_category() {
    let sql = studio_initial_migration_sql();

    for expected in [
        "CREATE TABLE IF NOT EXISTS studio_mcp_server",
        "CREATE TABLE IF NOT EXISTS studio_mcp_server_revision",
        "CREATE TABLE IF NOT EXISTS studio_mcp_tool",
        "CREATE TABLE IF NOT EXISTS studio_mcp_binding",
        "server_key VARCHAR(128) NOT NULL",
        "category_id BIGINT",
        "transport VARCHAR(64) NOT NULL",
        "endpoint_url VARCHAR(1024)",
        "command VARCHAR(1024)",
        "secret_ref VARCHAR(512)",
        "health_status VARCHAR(64) NOT NULL DEFAULT 'unchecked'",
        "input_schema JSONB NOT NULL DEFAULT '{}'::jsonb",
        "output_schema JSONB NOT NULL DEFAULT '{}'::jsonb",
        "allowed_tools JSONB NOT NULL DEFAULT '[]'::jsonb",
        "denied_tools JSONB NOT NULL DEFAULT '[]'::jsonb",
        "CONSTRAINT uk_studio_mcp_server_key",
        "CONSTRAINT uk_studio_mcp_server_revision_no",
        "CONSTRAINT uk_studio_mcp_tool_key",
        "CREATE INDEX IF NOT EXISTS idx_studio_mcp_server_category",
        "CREATE INDEX IF NOT EXISTS idx_studio_mcp_tool_server",
        "CREATE INDEX IF NOT EXISTS idx_studio_mcp_binding_owner",
    ] {
        assert!(
            sql.contains(expected),
            "studio MCP migration must contain `{expected}`",
        );
    }

    assert!(
        !sql.contains("CREATE TABLE IF NOT EXISTS studio_mcp_category"),
        "MCP must reuse the unified Category model through category_id",
    );
}

#[test]
fn template_tables_have_standard_context_columns_and_hot_path_indexes() {
    let sql = studio_initial_migration_sql();

    for table in [
        "studio_app_template",
        "studio_app_template_version",
        "studio_app_template_usage",
    ] {
        let definition = table_definition(sql, table).expect("table definition");
        for column in [
            "id BIGINT PRIMARY KEY",
            "uuid VARCHAR(64) NOT NULL UNIQUE",
            "created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP",
            "tenant_id BIGINT NOT NULL DEFAULT 0",
            "organization_id BIGINT NOT NULL DEFAULT 0",
            "data_scope INTEGER NOT NULL DEFAULT 0",
            "status INTEGER NOT NULL DEFAULT 1",
        ] {
            assert!(
                definition.contains(column),
                "{table} must contain standard column `{column}`",
            );
        }
    }

    for expected in [
        "CONSTRAINT uk_studio_app_template_no",
        "UNIQUE (tenant_id, template_no)",
        "CONSTRAINT uk_studio_app_template_code",
        "UNIQUE (tenant_id, organization_id, template_code)",
        "CONSTRAINT uk_studio_app_template_version_no",
        "UNIQUE (tenant_id, organization_id, template_id, version_no)",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_scope_status",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_category",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_type_runtime",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_git_source",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_featured",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_template",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_artifact",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_template",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_target",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_user",
        "CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_request",
    ] {
        assert!(
            sql.contains(expected),
            "studio migration must contain `{expected}`",
        );
    }
}

#[test]
fn manifest_declares_template_catalog_contract() {
    let manifest = studio_storage_capability_manifest();

    assert_eq!(manifest.name, "studio-app-template-storage");
    assert_eq!(manifest.schema_version, "2026-05-26");
    assert_eq!(
        manifest.migrations,
        vec![
            "0001_studio_catalog.sql",
            "0002_studio_app_template.sql",
            "0003_studio_prompt.sql",
            "0004_studio_mcp.sql",
        ],
    );
    assert_eq!(manifest.app_target_type, STUDIO_TARGET_TYPE_APP);
    assert_eq!(
        manifest.app_template_target_type,
        STUDIO_TARGET_TYPE_APP_TEMPLATE,
    );
    assert_eq!(manifest.prompt_target_type, STUDIO_TARGET_TYPE_PROMPT);
    assert_eq!(
        manifest.mcp_server_target_type,
        STUDIO_TARGET_TYPE_MCP_SERVER
    );
    assert_eq!(manifest.mcp_tool_target_type, STUDIO_TARGET_TYPE_MCP_TOOL);
    assert!(manifest
        .asset_store_tables
        .contains(&"studio_catalog_asset"));
    assert!(manifest
        .artifact_store_tables
        .contains(&"studio_catalog_artifact"));
    assert!(manifest
        .action_store_tables
        .contains(&"studio_catalog_action"));
    assert!(manifest
        .repository_bindings
        .iter()
        .any(|binding| binding.repository_name == "StudioAppTemplateRepository"));
    assert!(manifest
        .repository_bindings
        .iter()
        .any(|binding| binding.repository_name == "StudioPromptRepository"));
    assert!(manifest
        .repository_bindings
        .iter()
        .any(|binding| binding.repository_name == "StudioMcpRepository"));
}

fn table_definition<'a>(sql: &'a str, table_name: &str) -> Option<&'a str> {
    let marker = format!("CREATE TABLE IF NOT EXISTS {table_name}");
    let start = sql.find(&marker)?;
    let after_start = &sql[start..];
    let end = after_start.find("\n);")?;
    Some(&after_start[..end])
}
