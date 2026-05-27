pub const STUDIO_TARGET_TYPE_APP: i32 = 15;
pub const STUDIO_TARGET_TYPE_APP_TEMPLATE: i32 = 16;
pub const STUDIO_TARGET_TYPE_PROMPT: i32 = 17;
pub const STUDIO_TARGET_TYPE_MCP_SERVER: i32 = 18;
pub const STUDIO_TARGET_TYPE_MCP_TOOL: i32 = 19;

pub const STUDIO_CATALOG_MIGRATION: &str = "0001_studio_catalog.sql";
pub const STUDIO_APP_TEMPLATE_MIGRATION: &str = "0002_studio_app_template.sql";
pub const STUDIO_PROMPT_MIGRATION: &str = "0003_studio_prompt.sql";
pub const STUDIO_MCP_MIGRATION: &str = "0004_studio_mcp.sql";

const STUDIO_INITIAL_MIGRATION_SQL: &str = concat!(
    include_str!("../migrations/0001_studio_catalog.sql"),
    "\n",
    include_str!("../migrations/0002_studio_app_template.sql"),
    "\n",
    include_str!("../migrations/0003_studio_prompt.sql"),
    "\n",
    include_str!("../migrations/0004_studio_mcp.sql")
);

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StudioRepositoryBinding {
    pub domain: &'static str,
    pub repository_name: &'static str,
    pub tables: Vec<&'static str>,
    pub requires_transaction: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StudioStorageCapabilityManifest {
    pub name: &'static str,
    pub schema_version: &'static str,
    pub tables: Vec<&'static str>,
    pub shared_catalog_tables: Vec<&'static str>,
    pub app_template_tables: Vec<&'static str>,
    pub prompt_tables: Vec<&'static str>,
    pub mcp_tables: Vec<&'static str>,
    pub migrations: Vec<&'static str>,
    pub app_target_type: i32,
    pub app_template_target_type: i32,
    pub prompt_target_type: i32,
    pub mcp_server_target_type: i32,
    pub mcp_tool_target_type: i32,
    pub asset_store_tables: Vec<&'static str>,
    pub artifact_store_tables: Vec<&'static str>,
    pub action_store_tables: Vec<&'static str>,
    pub repository_bindings: Vec<StudioRepositoryBinding>,
}

pub fn studio_shared_catalog_tables() -> Vec<&'static str> {
    vec![
        "studio_catalog_action",
        "studio_catalog_asset",
        "studio_catalog_artifact",
    ]
}

pub fn studio_app_template_tables() -> Vec<&'static str> {
    vec![
        "studio_app_template",
        "studio_app_template_version",
        "studio_app_template_usage",
    ]
}

pub fn studio_prompt_tables() -> Vec<&'static str> {
    vec![
        "studio_prompt",
        "studio_prompt_version",
        "studio_prompt_binding",
    ]
}

pub fn studio_mcp_tables() -> Vec<&'static str> {
    vec![
        "studio_mcp_server",
        "studio_mcp_server_revision",
        "studio_mcp_tool",
        "studio_mcp_binding",
    ]
}

pub fn studio_database_tables() -> Vec<&'static str> {
    let mut tables = studio_shared_catalog_tables();
    tables.extend(studio_app_template_tables());
    tables.extend(studio_prompt_tables());
    tables.extend(studio_mcp_tables());
    tables
}

pub fn studio_initial_migration_sql() -> &'static str {
    STUDIO_INITIAL_MIGRATION_SQL
}

pub fn studio_storage_capability_manifest() -> StudioStorageCapabilityManifest {
    StudioStorageCapabilityManifest {
        name: "studio-app-template-storage",
        schema_version: "2026-05-26",
        tables: studio_database_tables(),
        shared_catalog_tables: studio_shared_catalog_tables(),
        app_template_tables: studio_app_template_tables(),
        prompt_tables: studio_prompt_tables(),
        mcp_tables: studio_mcp_tables(),
        migrations: vec![
            STUDIO_CATALOG_MIGRATION,
            STUDIO_APP_TEMPLATE_MIGRATION,
            STUDIO_PROMPT_MIGRATION,
            STUDIO_MCP_MIGRATION,
        ],
        app_target_type: STUDIO_TARGET_TYPE_APP,
        app_template_target_type: STUDIO_TARGET_TYPE_APP_TEMPLATE,
        prompt_target_type: STUDIO_TARGET_TYPE_PROMPT,
        mcp_server_target_type: STUDIO_TARGET_TYPE_MCP_SERVER,
        mcp_tool_target_type: STUDIO_TARGET_TYPE_MCP_TOOL,
        asset_store_tables: vec!["studio_catalog_asset"],
        artifact_store_tables: vec!["studio_catalog_artifact"],
        action_store_tables: vec!["studio_catalog_action"],
        repository_bindings: vec![
            StudioRepositoryBinding {
                domain: "studio",
                repository_name: "StudioAppTemplateRepository",
                tables: studio_app_template_tables(),
                requires_transaction: true,
            },
            StudioRepositoryBinding {
                domain: "studio",
                repository_name: "StudioPromptRepository",
                tables: studio_prompt_tables(),
                requires_transaction: true,
            },
            StudioRepositoryBinding {
                domain: "studio",
                repository_name: "StudioMcpRepository",
                tables: studio_mcp_tables(),
                requires_transaction: true,
            },
        ],
    }
}
