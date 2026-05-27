const ADMIN_API_LIB: &str = include_str!("../src/lib.rs");

#[test]
fn admin_api_database_runtime_mounts_prompt_and_mcp_centers() {
    for expected in [
        "AdminPromptRuntimeStore",
        "AdminMcpRuntimeStore",
        "SqliteAdminPromptStore::new(pool.clone())",
        "SqliteAdminMcpStore::new(pool.clone())",
        "PostgresAdminPromptStore::new(pool.clone())",
        "PostgresAdminMcpStore::new(pool.clone())",
        "admin_prompt_router_with_store",
        "admin_mcp_router_with_store",
        "prompt_store: Some(prompt_store)",
        "mcp_store: Some(mcp_store)",
    ] {
        assert!(
            ADMIN_API_LIB.contains(expected),
            "admin api runtime must contain `{expected}`"
        );
    }
}
