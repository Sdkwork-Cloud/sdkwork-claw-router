const POSTGRES_SCHEMA: &str = include_str!("../../../generated/schema/postgres/schema.sql");
const POSTGRES_PROMPT_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_prompt_store.rs");
const POSTGRES_MCP_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/admin_mcp_store.rs");

fn compact_sql(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn assert_contains(source: &str, expected: &str) {
    let source = compact_sql(source);
    let expected = compact_sql(expected);
    assert!(source.contains(&expected), "missing `{expected}`");
}

fn assert_not_contains(source: &str, forbidden: &str) {
    let source = compact_sql(source).to_ascii_lowercase();
    let forbidden = compact_sql(forbidden).to_ascii_lowercase();
    assert!(!source.contains(&forbidden), "forbidden `{forbidden}`");
}

#[test]
fn prompt_and_mcp_tables_exist_in_postgres_schema() {
    for table in [
        "ai_prompt",
        "ai_prompt_version",
        "ai_prompt_binding",
        "ai_mcp_server",
        "ai_mcp_server_revision",
        "ai_mcp_tool",
        "ai_mcp_binding",
    ] {
        assert_contains(
            POSTGRES_SCHEMA,
            &format!("CREATE TABLE IF NOT EXISTS {table}"),
        );
    }
}

#[test]
fn postgres_prompt_store_uses_vertical_prompt_tables_and_jsonb() {
    for expected in [
        "pub struct PostgresAdminPromptStore",
        "impl AdminPromptStore for PostgresAdminPromptStore",
        "FROM ai_prompt p",
        "INSERT INTO ai_prompt",
        "INSERT INTO ai_prompt_version",
        "FROM ai_prompt_binding",
        "RETURNING id",
        "$12::jsonb",
        "$8::jsonb",
        "$9::jsonb",
        "$10::jsonb",
        "$11::jsonb",
        "$12::jsonb",
        "published_version_id = $1",
    ] {
        assert_contains(POSTGRES_PROMPT_STORE, expected);
    }
}

#[test]
fn postgres_mcp_store_uses_vertical_mcp_tables_and_jsonb() {
    for expected in [
        "pub struct PostgresAdminMcpStore",
        "impl AdminMcpStore for PostgresAdminMcpStore",
        "FROM ai_mcp_server",
        "INSERT INTO ai_mcp_server",
        "INSERT INTO ai_mcp_server_revision",
        "FROM ai_mcp_tool",
        "FROM ai_mcp_binding",
        "RETURNING id",
        "$12::jsonb",
        "$9::jsonb",
        "$10::jsonb",
        "$14::jsonb",
        "published_revision_id = $1",
        "health_status = 'healthy'",
    ] {
        assert_contains(POSTGRES_MCP_STORE, expected);
    }
}

#[test]
fn prompt_and_mcp_stores_do_not_reintroduce_generic_capability_design() {
    for (label, source) in [
        ("prompt", POSTGRES_PROMPT_STORE),
        ("mcp", POSTGRES_MCP_STORE),
    ] {
        assert_not_contains(source, "capability_store");
        assert_not_contains(source, "/capabilities/");
        assert_not_contains(source, "generic capability");
        assert_not_contains(source, "capability_workbench");
        assert!(
            source.contains("category_id") && source.contains("category_code"),
            "{label} store must keep category reuse as fields, not capability abstraction"
        );
    }
}
