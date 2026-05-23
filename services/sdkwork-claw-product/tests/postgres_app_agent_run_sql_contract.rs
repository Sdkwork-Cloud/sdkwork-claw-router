use std::fs;
use std::path::Path;

#[test]
fn postgres_app_agent_run_store_uses_product_agent_session_and_user_scoped_queries() {
    let source = read_workspace_file(
        "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_agent_run_store.rs",
    );

    assert!(
        source.contains("AND user_id = $3"),
        "Postgres AgentRun store must scope run reads by trusted user id"
    );
    assert!(
        source.contains("agent_session_id = $4"),
        "Postgres AgentRun store must list runs by agent session id"
    );
    assert!(
        source.contains("runtime_invocation_id"),
        "Postgres AgentRunStep store must persist runtime invocation linkage"
    );
    assert!(
        source.contains("UPDATE ai_runtime_invocation"),
        "Postgres AgentRunStep store must backfill runtime invocation linkage"
    );
    assert!(
        source.contains("agent_run_step_id = $2"),
        "Postgres AgentRunStep store must backfill runtime invocation step linkage"
    );
    assert!(
        source.contains("UPDATE ai_agent_session"),
        "Postgres AgentRun store must keep agent session counters up to date"
    );
    assert!(
        source.contains("last_active_at = $2::timestamp AT TIME ZONE 'UTC'")
            || source.contains("last_active_at = $3::timestamp AT TIME ZONE 'UTC'"),
        "Postgres AgentRun store must keep agent session lastActiveAt up to date"
    );
    assert!(
        source.contains("last_step_id = $2"),
        "Postgres AgentRunStep store must keep agent session lastStepId up to date"
    );
    assert!(
        source.contains(
            "tool_call_count = CASE WHEN $4 THEN tool_call_count + 1 ELSE tool_call_count END"
        ),
        "Postgres AgentRunStep store must count tool steps at the agent session level"
    );
    assert!(
        source.contains("INSERT INTO ai_runtime_usage_link"),
        "Postgres AgentRun store must write normalized runtime usage links"
    );
    assert!(
        source.contains("'agent_step'"),
        "Postgres AgentRunStep store must classify step-level usage as agent_step"
    );
    assert!(
        source.contains("'agent_run_total'"),
        "Postgres AgentRun store must classify run aggregate usage as agent_run_total"
    );
    assert!(
        source.contains("ON CONFLICT (tenant_id, organization_id, user_id, agent_run_id, usage_type, agent_run_step_id_key) DO UPDATE"),
        "Postgres AgentRun store must keep agent run usage links idempotent"
    );
    assert!(
        source.contains("agent run memorySpaceId must match the agent session"),
        "Postgres AgentRun store must reject memory-space drift from the owning AgentSession"
    );
    assert!(
        source.contains("agent run runtime must match the agent session"),
        "Postgres AgentRun store must reject runtime drift from the owning AgentSession"
    );
}

#[test]
fn postgres_app_agent_run_store_filters_deleted_lifecycle_records() {
    let source = read_workspace_file(
        "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_agent_run_store.rs",
    );
    let compact = source.split_whitespace().collect::<Vec<_>>().join(" ");

    assert!(
        compact
            .contains("AND agent_session_id = $4 AND status <> 'deleted' ORDER BY created_at DESC"),
        "Postgres AgentRun list query must hide lifecycle-deleted runs"
    );
    assert!(
        compact.contains("AND (run_uuid = $4 OR uuid = $4) AND status <> 'deleted'"),
        "Postgres AgentRun detail/loading query must hide lifecycle-deleted runs"
    );
    assert!(
        compact.contains("AND s.user_id = $3 AND s.run_id = $4 AND s.status <> 'deleted' AND r.status <> 'deleted'"),
        "Postgres AgentRunStep list query must hide lifecycle-deleted steps and deleted owning runs"
    );
}

#[test]
fn postgres_app_agent_run_step_queries_scope_to_trusted_user_id() {
    let source = read_workspace_file(
        "services/sdkwork-claw-product/src/infrastructure/sql/postgres/app_agent_run_store.rs",
    );
    let compact = source.split_whitespace().collect::<Vec<_>>().join(" ");

    assert!(
        compact.contains("AND r.user_id = s.user_id WHERE s.tenant_id = $1 AND s.organization_id = $2 AND s.user_id = $3 AND s.run_id = $4"),
        "Postgres AgentRunStep list query must join steps to runs through trusted user ownership"
    );
    assert!(
        compact.contains(
            "WHERE s.tenant_id = $1 AND s.organization_id = $2 AND s.user_id = $3 AND s.run_id = $4"
        ),
        "Postgres AgentRunStep list query must scope step rows by trusted user id"
    );
    assert!(
        compact.contains("AND r.user_id = s.user_id WHERE s.uuid = $1 AND s.tenant_id = $2 AND s.organization_id = $3 AND s.user_id = $4"),
        "Postgres AgentRunStep creation reload query must join steps to runs through trusted user ownership"
    );
    assert!(
        compact.contains(
            "WHERE s.uuid = $1 AND s.tenant_id = $2 AND s.organization_id = $3 AND s.user_id = $4"
        ),
        "Postgres AgentRunStep creation reload query must scope step rows by trusted user id"
    );
    assert!(
        compact.contains("FROM ai_agent_run_step WHERE tenant_id = $1 AND organization_id = $2 AND user_id = $3 AND run_id = $4"),
        "Postgres AgentRunStep count and sequencing queries must scope step rows by trusted user id"
    );
    assert!(
        compact.contains("WHERE s.uuid = $1 AND s.tenant_id = $2 AND s.organization_id = $3 AND s.user_id = $4 AND r.run_uuid = $5"),
        "Postgres AgentRunStep completion load query must scope step rows by trusted user id and owning run id"
    );
    assert!(
        compact.contains("AND r.user_id = s.user_id WHERE s.uuid = $1 AND s.tenant_id = $2 AND s.organization_id = $3 AND s.user_id = $4 AND r.run_uuid = $5"),
        "Postgres AgentRunStep completion load query must join steps to runs through trusted user ownership"
    );
}

#[test]
fn postgres_schema_contains_product_agent_run_columns_and_indexes() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");

    assert!(
        schema.contains("agent_session_id VARCHAR(128)"),
        "ai_agent_run must link back to the product AgentSession"
    );
    assert!(
        schema.contains("memory_space_id VARCHAR(128)"),
        "ai_agent_run must link to MemorySpace for agent memory context"
    );
    assert!(
        schema.contains("runtime VARCHAR(128)"),
        "ai_agent_run must preserve selected runtime"
    );
    assert!(
        schema.contains("model VARCHAR(128)"),
        "ai_agent_run must preserve selected model"
    );
    assert!(
        schema.contains("usage_json JSONB"),
        "ai_agent_run must preserve provider-normalized usage JSON"
    );
    assert!(
        schema.contains("CREATE TABLE IF NOT EXISTS ai_runtime_usage_link")
            && schema.contains("user_id BIGINT NOT NULL"),
        "ai_runtime_usage_link must require a trusted product user id"
    );
    assert!(
        !postgres_table(&schema, "ai_runtime_usage_link")
            .contains("user_id BIGINT NOT NULL DEFAULT"),
        "ai_runtime_usage_link must not silently default missing product user ownership"
    );
    assert!(
        schema.contains("runtime_invocation_id VARCHAR(128)"),
        "ai_agent_run_step must link to RuntimeInvocation"
    );
    assert!(
        schema.contains("last_run_id VARCHAR(128)"),
        "ai_agent_session must preserve the latest external AgentRun id"
    );
    assert!(
        schema.contains("last_step_id BIGINT"),
        "ai_agent_session must preserve the latest internal AgentRunStep row id for resume state"
    );
    assert!(
        schema.contains("last_active_at TIMESTAMPTZ"),
        "ai_agent_session must preserve the latest activity timestamp for resumable sessions"
    );
    assert!(
        schema.contains("tool_name VARCHAR(128)"),
        "ai_agent_run_step must preserve non-catalog runtime/tool names"
    );
    assert!(
        schema.contains(
            "idx_ai_agent_run_session_created ON ai_agent_run (tenant_id, organization_id, user_id, agent_session_id, created_at, id)"
        ),
        "ai_agent_run must have a product session timeline index"
    );
    assert!(
        schema.contains(
            "idx_ai_agent_run_step_runtime_invocation ON ai_agent_run_step (tenant_id, organization_id, runtime_invocation_id)"
        ),
        "ai_agent_run_step must have a runtime invocation lookup index"
    );
    assert!(
        postgres_table(&schema, "ai_runtime_usage_link").contains("agent_run_step_id_key VARCHAR(128) GENERATED ALWAYS AS (COALESCE(agent_run_step_id, '')) STORED"),
        "ai_runtime_usage_link must expose a generated key for idempotent agent run usage totals"
    );
    assert!(
        schema.contains(
            "uk_ai_runtime_usage_link_agent_scope ON ai_runtime_usage_link (tenant_id, organization_id, user_id, agent_run_id, usage_type, agent_run_step_id_key)"
        ),
        "ai_runtime_usage_link must prevent duplicate agent run and step usage links"
    );
}

fn read_workspace_file(relative_path: &str) -> String {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .and_then(Path::parent)
        .expect("sdkwork-claw-product must live under services/")
        .join(relative_path);
    fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("failed to read {}: {error}", path.display()))
}

fn postgres_table<'a>(schema: &'a str, table: &str) -> &'a str {
    let start_marker = format!("CREATE TABLE IF NOT EXISTS {table} (");
    let start = schema
        .find(&start_marker)
        .unwrap_or_else(|| panic!("Postgres schema must define table {table}"));
    let remaining = &schema[start..];
    let end = remaining
        .find("\n);")
        .unwrap_or_else(|| panic!("Postgres schema table {table} must be closed"));
    &remaining[..end]
}
