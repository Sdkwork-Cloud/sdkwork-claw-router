use std::fs;
use std::path::Path;

const STANDARD_TABLES: &[&str] = &[
    "ai_chat_conversation",
    "ai_chat_turn",
    "ai_chat_item",
    "ai_chat_message",
    "ai_chat_message_part",
    "ai_chat_context_snapshot",
    "ai_agent_session",
    "ai_agent_run",
    "ai_agent_run_step",
    "ai_memory_space",
    "ai_memory_space_binding",
    "ai_memory_entry",
    "ai_memory_embedding",
    "ai_memory_event",
    "ai_memory_link",
    "ai_runtime_invocation",
    "ai_runtime_invocation_event",
    "ai_runtime_usage_link",
    "ai_runtime_artifact",
];

#[test]
fn postgres_schema_contains_chat_agent_memory_runtime_standard_tables() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");

    for table in STANDARD_TABLES {
        assert!(
            schema.contains(&format!("CREATE TABLE IF NOT EXISTS {table}")),
            "Postgres schema must define standard table {table}"
        );
    }
}

#[test]
fn schema_registry_contains_chat_agent_memory_runtime_standard_tables() {
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");

    for table in STANDARD_TABLES {
        assert!(
            registry.contains(&format!("table: {table}")),
            "schema registry must define standard table {table}"
        );
    }
}

#[test]
fn frontend_contract_uses_chat_and_agents_product_paths_not_playground_paths() {
    let contracts = read_workspace_file("docs/schema-registry/frontend-field-contracts.yaml");

    assert!(
        contracts.contains("api_path: /app/v3/api/chat/conversations"),
        "frontend field contracts must document the product Chat conversations API"
    );
    assert!(
        contracts.contains(
            "api_path: /app/v3/api/chat/conversations/{conversationId}/turns/{turnId}/response"
        ),
        "frontend field contracts must document the product Chat turn response API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/agents/{agentId}/sessions"),
        "frontend field contracts must document the product Agent sessions API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/agents/sessions/{sessionId}/runs"),
        "frontend field contracts must document the product Agent runs API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/agents/runs/{runId}/steps"),
        "frontend field contracts must document the product Agent run steps API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/agents/runs/{runId}/complete"),
        "frontend field contracts must document the product Agent run completion API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/memory/spaces"),
        "frontend field contracts must document the product Memory spaces API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/memory/spaces/{spaceId}/entries"),
        "frontend field contracts must document the product Memory entries API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/runtime/invocations"),
        "frontend field contracts must document the product Runtime invocations API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/runtime/invocations/{invocationId}/events"),
        "frontend field contracts must document the product Runtime events API"
    );
    assert!(
        contracts.contains("api_path: /app/v3/api/runtime/invocations/{invocationId}/artifacts"),
        "frontend field contracts must document the product Runtime artifacts API"
    );
    assert!(
        !contracts.contains("/app/v3/api/playground"),
        "backend app APIs must not be introduced under a playground namespace"
    );
}

#[test]
fn runtime_invocation_schema_is_user_scoped_for_product_chat_and_agent_runs() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");
    let invocation_table = postgres_table(&schema, "ai_runtime_invocation");

    assert!(
        invocation_table.contains("user_id BIGINT NOT NULL"),
        "Postgres runtime invocations must require a trusted product user id"
    );
    assert!(
        !invocation_table.contains("user_id BIGINT NOT NULL DEFAULT"),
        "Postgres runtime invocations must not silently default missing product user ownership"
    );
    let invocation_registry = registry_table(&registry, "ai_runtime_invocation");
    assert_registry_required_columns(
        invocation_registry,
        "ai_runtime_invocation",
        &[
            "uuid",
            "tenant_id",
            "organization_id",
            "user_id",
            "invocation_no",
            "invocation_type",
            "runtime",
            "status",
        ],
    );
    assert_registry_index_columns(
        invocation_registry,
        "idx_ai_runtime_invocation_user_created",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "created_at",
            "id",
        ],
        false,
    );
}

#[test]
fn runtime_invocation_schema_matches_runtime_store_lifecycle_contract() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");
    let invocation_table = postgres_table(&schema, "ai_runtime_invocation");

    for expected in [
        "status VARCHAR(64) NOT NULL DEFAULT 'running'",
        "streaming BOOLEAN NOT NULL DEFAULT FALSE",
        "started_at TIMESTAMPTZ",
        "completed_at TIMESTAMPTZ",
        "latency_ms BIGINT",
        "ttft_ms BIGINT",
        "exit_code BIGINT",
        "finish_reason VARCHAR(128)",
        "error_type VARCHAR(128)",
        "error_code VARCHAR(128)",
        "error_message_masked VARCHAR(1024)",
    ] {
        assert!(
            invocation_table.contains(expected),
            "Postgres runtime invocation schema must contain `{expected}`"
        );
    }

    let invocation_registry = registry_table(&registry, "ai_runtime_invocation");
    assert_registry_column_type(
        invocation_registry,
        "ai_runtime_invocation",
        "status",
        "string(64)",
    );
    assert_registry_column_constraints(
        invocation_registry,
        "ai_runtime_invocation",
        "status",
        "NOT NULL DEFAULT 'running'",
    );
    assert_registry_column_type(
        invocation_registry,
        "ai_runtime_invocation",
        "streaming",
        "bool",
    );
    assert_registry_column_constraints(
        invocation_registry,
        "ai_runtime_invocation",
        "streaming",
        "NOT NULL DEFAULT FALSE",
    );
    for expected in [
        "started_at: instant",
        "completed_at: instant",
        "latency_ms: int64",
        "ttft_ms: int64",
        "exit_code: int64",
        "finish_reason: string(128)",
        "error_type: string(128)",
        "error_code: string(128)",
        "error_message_masked: string(1024)",
    ] {
        assert!(
            invocation_registry.contains(expected),
            "schema registry must document runtime invocation column `{expected}`"
        );
    }
}

#[test]
fn chat_and_agent_standard_tables_use_string_lifecycle_statuses() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");

    for (table_name, expected_default, expected_registry_fragment) in [
        (
            "ai_chat_conversation",
            "'active'",
            "constraints: NOT NULL DEFAULT 'active'",
        ),
        (
            "ai_chat_turn",
            "'running'",
            "constraints: NOT NULL DEFAULT 'running'",
        ),
        (
            "ai_chat_item",
            "'pending'",
            "constraints: NOT NULL DEFAULT 'pending'",
        ),
        (
            "ai_chat_message",
            "'active'",
            "constraints: NOT NULL DEFAULT 'active'",
        ),
        (
            "ai_chat_message_part",
            "'active'",
            "constraints: NOT NULL DEFAULT 'active'",
        ),
        (
            "ai_chat_context_snapshot",
            "'active'",
            "constraints: NOT NULL DEFAULT 'active'",
        ),
        (
            "ai_agent_session",
            "'active'",
            "constraints: NOT NULL DEFAULT 'active'",
        ),
        (
            "ai_agent_run",
            "'active'",
            "constraints: NOT NULL DEFAULT 'active'",
        ),
        (
            "ai_agent_run_step",
            "'active'",
            "constraints: NOT NULL DEFAULT 'active'",
        ),
    ] {
        let table = postgres_table(&schema, table_name);
        assert!(
            table.contains(&format!(
                "status VARCHAR(64) NOT NULL DEFAULT {expected_default}"
            )),
            "Postgres {table_name}.status must be a readable string lifecycle status"
        );
        let registry_table = registry_table(&registry, table_name);
        assert!(
            registry_table.contains("status:"),
            "schema registry must document {table_name}.status"
        );
        assert!(
            registry_table.contains("type: string(64)"),
            "schema registry must document {table_name}.status as string(64)"
        );
        assert!(
            registry_table.contains(expected_registry_fragment),
            "schema registry must document {table_name}.status with the expected lifecycle default"
        );
    }

    let agent_run = postgres_table(&schema, "ai_agent_run");
    assert!(
        agent_run.contains("run_status VARCHAR(64) NOT NULL DEFAULT 'running'"),
        "Postgres ai_agent_run.run_status must store the agent execution lifecycle label"
    );
    assert!(
        registry_column_block(registry_table(&registry, "ai_agent_run"), "run_status")
            .contains("type: string(64)"),
        "schema registry must document ai_agent_run.run_status as string(64)"
    );

    let agent_run_step = postgres_table(&schema, "ai_agent_run_step");
    assert!(
        agent_run_step.contains("step_status VARCHAR(64) NOT NULL DEFAULT 'running'"),
        "Postgres ai_agent_run_step.step_status must store the step execution lifecycle label"
    );
    assert!(
        registry_column_block(
            registry_table(&registry, "ai_agent_run_step"),
            "step_status"
        )
        .contains("type: string(64)"),
        "schema registry must document ai_agent_run_step.step_status as string(64)"
    );
}

#[test]
fn chat_context_snapshot_schema_matches_turn_context_contract() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");
    let turn_table = postgres_table(&schema, "ai_chat_turn");
    let snapshot_table = postgres_table(&schema, "ai_chat_context_snapshot");
    let snapshot_registry = registry_table(&registry, "ai_chat_context_snapshot");

    assert!(
        turn_table.contains("context_snapshot_id BIGINT"),
        "Postgres ai_chat_turn must link the context snapshot used by the turn"
    );
    for expected in [
        "status VARCHAR(64) NOT NULL DEFAULT 'active'",
        "conversation_id BIGINT NOT NULL",
        "turn_id BIGINT",
        "runtime_invocation_id BIGINT",
        "snapshot_no INTEGER NOT NULL",
        "strategy VARCHAR(64) NOT NULL",
        "included_item_ids JSONB",
        "excluded_item_ids JSONB",
        "included_memory_ids JSONB",
        "excluded_memory_ids JSONB",
        "memory_pack JSONB",
        "memory_token_count BIGINT",
        "provider_conversation_id VARCHAR(128)",
        "previous_response_id VARCHAR(128)",
        "input_token_estimate BIGINT",
        "truncation_reason VARCHAR(256)",
        "context_json JSONB",
    ] {
        assert!(
            snapshot_table.contains(expected),
            "Postgres ai_chat_context_snapshot schema must contain `{expected}`"
        );
    }
    assert_registry_required_columns(
        snapshot_registry,
        "ai_chat_context_snapshot",
        &[
            "uuid",
            "tenant_id",
            "organization_id",
            "user_id",
            "conversation_id",
            "snapshot_no",
            "strategy",
        ],
    );
    for expected in [
        "context_json: json",
        "included_item_ids: json",
        "included_memory_ids: json",
        "provider_conversation_id: string(128)",
        "previous_response_id: string(128)",
        "input_token_estimate: int64",
    ] {
        assert!(
            snapshot_registry.contains(expected),
            "schema registry must document context snapshot column `{expected}`"
        );
    }
}

#[test]
fn runtime_events_and_artifacts_are_user_scoped_fact_tables() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");
    let event_table = postgres_table(&schema, "ai_runtime_invocation_event");
    let artifact_table = postgres_table(&schema, "ai_runtime_artifact");

    assert!(
        schema.contains("CREATE TABLE IF NOT EXISTS ai_runtime_invocation_event"),
        "Postgres schema must define ai_runtime_invocation_event"
    );
    assert!(
        event_table.contains("user_id BIGINT NOT NULL"),
        "Postgres runtime invocation events must require a trusted product user id"
    );
    assert!(
        artifact_table.contains("user_id BIGINT NOT NULL"),
        "Postgres runtime artifacts must require a trusted product user id"
    );
    assert!(
        !event_table.contains("user_id BIGINT NOT NULL DEFAULT")
            && !artifact_table.contains("user_id BIGINT NOT NULL DEFAULT"),
        "Postgres runtime event and artifact writes must not silently default missing product user ownership"
    );
    for expected in [
        "media_resource_id VARCHAR(128)",
        "object_blob_id BIGINT",
        "resource_snapshot JSONB",
    ] {
        assert!(
            artifact_table.contains(expected),
            "Postgres runtime artifacts must expose canonical resource column `{expected}`"
        );
    }
    for forbidden in ["storage_url", "storage_key"] {
        assert!(
            !artifact_table.contains(forbidden),
            "Postgres runtime artifacts must not fall back to legacy column `{forbidden}`"
        );
    }
    for table_name in ["ai_runtime_invocation_event", "ai_runtime_artifact"] {
        let table = postgres_table(&schema, table_name);
        assert!(
            table.contains("status VARCHAR(64) NOT NULL DEFAULT 'active'"),
            "Postgres {table_name}.status must use the shared string lifecycle status contract"
        );
        let table_registry = registry_table(&registry, table_name);
        assert_registry_column_type(table_registry, table_name, "status", "string(64)");
        assert_registry_column_constraints(
            table_registry,
            table_name,
            "status",
            "NOT NULL DEFAULT 'active'",
        );
    }
    assert!(
        schema.contains("idx_ai_runtime_invocation_event_user_created"),
        "Postgres runtime invocation event must have a user timeline index"
    );
    assert!(
        schema.contains("idx_ai_runtime_artifact_user_created"),
        "Postgres runtime artifact must have a user timeline index"
    );
    assert!(
        registry.contains("user_id: int64"),
        "schema registry must record user_id on runtime event and artifact tables"
    );
    let artifact_registry = registry_table(&registry, "ai_runtime_artifact");
    for expected in [
        "media_resource_id: string(128)",
        "object_blob_id: int64",
        "resource_snapshot: json",
    ] {
        assert!(
            artifact_registry.contains(expected),
            "schema registry runtime artifact contract must document `{expected}`"
        );
    }
    for forbidden in ["storage_url:", "storage_key:"] {
        assert!(
            !artifact_registry.contains(forbidden),
            "schema registry runtime artifact contract must not document legacy column `{forbidden}`"
        );
    }
    assert_registry_index_columns(
        registry_table(&registry, "ai_runtime_invocation_event"),
        "idx_ai_runtime_invocation_event_user_created",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "created_at",
            "id",
        ],
        false,
    );
    assert_registry_index_columns(
        registry_table(&registry, "ai_runtime_artifact"),
        "idx_ai_runtime_artifact_user_created",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "created_at",
            "id",
        ],
        false,
    );
}

#[test]
fn memory_spaces_entries_and_memory_events_are_user_scoped_product_records() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");
    let space_table = postgres_table(&schema, "ai_memory_space");
    let entry_table = postgres_table(&schema, "ai_memory_entry");
    let event_table = postgres_table(&schema, "ai_memory_event");
    let link_table = postgres_table(&schema, "ai_memory_link");

    assert!(
        space_table.contains("user_id BIGINT NOT NULL"),
        "Postgres memory spaces must require trusted product user ownership"
    );
    assert!(
        entry_table.contains("user_id BIGINT NOT NULL"),
        "Postgres memory entries must require trusted product user ownership"
    );
    assert!(
        event_table.contains("user_id BIGINT NOT NULL"),
        "Postgres memory events must require trusted product user ownership"
    );
    assert!(
        link_table.contains("user_id BIGINT NOT NULL"),
        "Postgres memory links must require trusted product user ownership"
    );
    assert!(
        !space_table.contains("user_id BIGINT NOT NULL DEFAULT")
            && !entry_table.contains("user_id BIGINT NOT NULL DEFAULT")
            && !event_table.contains("user_id BIGINT NOT NULL DEFAULT")
            && !link_table.contains("user_id BIGINT NOT NULL DEFAULT"),
        "memory product ownership must come from the trusted subject, not a silent database default"
    );
    for table_name in [
        "ai_memory_space",
        "ai_memory_space_binding",
        "ai_memory_entry",
        "ai_memory_embedding",
        "ai_memory_event",
        "ai_memory_link",
    ] {
        let table = postgres_table(&schema, table_name);
        assert!(
            table.contains("status VARCHAR(64) NOT NULL DEFAULT 'active'"),
            "Postgres {table_name}.status must use the shared string lifecycle status contract"
        );
        let table_registry = registry_table(&registry, table_name);
        assert_registry_column_type(table_registry, table_name, "status", "string(64)");
        assert_registry_column_constraints(
            table_registry,
            table_name,
            "status",
            "NOT NULL DEFAULT 'active'",
        );
    }
    let memory_space_registry = registry_table(&registry, "ai_memory_space");
    assert_registry_required_columns(
        memory_space_registry,
        "ai_memory_space",
        &[
            "uuid",
            "tenant_id",
            "organization_id",
            "user_id",
            "space_type",
            "title",
            "status",
        ],
    );
    assert_registry_index_columns(
        memory_space_registry,
        "idx_ai_memory_space_user_updated",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "updated_at",
            "id",
        ],
        false,
    );
    assert_registry_index_columns(
        registry_table(&registry, "ai_memory_entry"),
        "idx_ai_memory_entry_user_status",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "status",
            "updated_at",
            "id",
        ],
        false,
    );
    assert_registry_index_columns(
        registry_table(&registry, "ai_memory_event"),
        "idx_ai_memory_event_user_created",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "created_at",
            "id",
        ],
        false,
    );
    assert_registry_index_columns(
        registry_table(&registry, "ai_memory_link"),
        "idx_ai_memory_link_user_created",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "created_at",
            "id",
        ],
        false,
    );
}

#[test]
fn runtime_usage_links_are_user_scoped_and_agent_idempotent() {
    let schema = read_workspace_file("generated/schema/postgres/schema.sql");
    let registry =
        read_workspace_file("generated/schema/registry/sdkwork-claw-router.tables.effective.yaml");
    let usage_link_table = postgres_table(&schema, "ai_runtime_usage_link");

    assert!(
        schema.contains("CREATE TABLE IF NOT EXISTS ai_runtime_usage_link"),
        "Postgres schema must define ai_runtime_usage_link"
    );
    assert!(
        usage_link_table.contains("user_id BIGINT NOT NULL"),
        "Postgres runtime usage links must require a trusted product user id"
    );
    assert!(
        !usage_link_table.contains("user_id BIGINT NOT NULL DEFAULT"),
        "Postgres runtime usage links must not silently default missing product user ownership"
    );
    assert!(
        usage_link_table.contains("status VARCHAR(64) NOT NULL DEFAULT 'active'"),
        "Postgres runtime usage links must use the shared string lifecycle status contract"
    );
    assert!(
        usage_link_table.contains(
            "agent_run_step_id_key VARCHAR(128) GENERATED ALWAYS AS (COALESCE(agent_run_step_id, '')) STORED"
        ),
        "Postgres runtime usage links must expose a stable key for run-total idempotency"
    );
    assert!(
        schema.contains(
            "uk_ai_runtime_usage_link_agent_scope ON ai_runtime_usage_link (tenant_id, organization_id, user_id, agent_run_id, usage_type, agent_run_step_id_key)"
        ),
        "Postgres runtime usage links must prevent duplicate agent run/step usage facts"
    );
    let usage_link_registry = registry_table(&registry, "ai_runtime_usage_link");
    assert_registry_column_type(
        usage_link_registry,
        "ai_runtime_usage_link",
        "status",
        "string(64)",
    );
    assert_registry_column_constraints(
        usage_link_registry,
        "ai_runtime_usage_link",
        "status",
        "NOT NULL DEFAULT 'active'",
    );
    assert_registry_required_columns(
        usage_link_registry,
        "ai_runtime_usage_link",
        &[
            "uuid",
            "tenant_id",
            "organization_id",
            "user_id",
            "usage_type",
            "status",
        ],
    );
    assert_registry_index_columns(
        usage_link_registry,
        "uk_ai_runtime_usage_link_agent_scope",
        &[
            "tenant_id",
            "organization_id",
            "user_id",
            "agent_run_id",
            "usage_type",
            "agent_run_step_id_key",
        ],
        true,
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
        .replace("\r\n", "\n")
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

fn registry_table<'a>(registry: &'a str, table: &str) -> &'a str {
    let start_marker = format!("- table: {table}\n");
    let start = registry
        .find(&start_marker)
        .unwrap_or_else(|| panic!("schema registry must define table {table}"));
    let remaining = &registry[start..];
    let end = remaining[1..]
        .find("\n- table: ")
        .map(|offset| offset + 1)
        .unwrap_or(remaining.len());
    &remaining[..end]
}

fn assert_registry_required_columns(registry_table: &str, table: &str, columns: &[&str]) {
    let start = registry_table
        .find("\n  required_columns:\n")
        .unwrap_or_else(|| panic!("schema registry table {table} must define required_columns"));
    let remaining = &registry_table[start..];
    let end = remaining
        .find("\n  columns:\n")
        .unwrap_or_else(|| panic!("schema registry table {table} must define columns"));
    let required_columns = &remaining[..end];
    for column in columns {
        assert!(
            yaml_list_contains(required_columns, column),
            "schema registry table {table} must mark {column} as required"
        );
    }
}

fn assert_registry_index_columns(
    registry_table: &str,
    index_name: &str,
    columns: &[&str],
    unique: bool,
) {
    let start_marker = format!("\n  - name: {index_name}\n");
    let start = registry_table
        .find(&start_marker)
        .unwrap_or_else(|| panic!("schema registry must document index {index_name}"));
    let remaining = &registry_table[start..];
    let end = remaining[1..]
        .find("\n  - name: ")
        .map(|offset| offset + 1)
        .or_else(|| {
            remaining[1..]
                .find("\n  security:")
                .map(|offset| offset + 1)
        })
        .unwrap_or(remaining.len());
    let index = &remaining[..end];
    if unique {
        assert!(
            index.lines().any(|line| line.trim() == "unique: true"),
            "schema registry index {index_name} must be unique"
        );
    }
    for column in columns {
        assert!(
            yaml_list_contains(index, column),
            "schema registry index {index_name} must include column {column}"
        );
    }
}

fn yaml_list_contains(block: &str, value: &str) -> bool {
    let expected = format!("- {value}");
    block.lines().any(|line| line.trim() == expected)
}

fn assert_registry_column_type(
    registry_table: &str,
    table: &str,
    column: &str,
    expected_type: &str,
) {
    let column_block = registry_column_block(registry_table, column);
    let expected = format!("type: {expected_type}");
    assert!(
        column_block.contains(&expected),
        "schema registry table {table}.{column} must document {expected}"
    );
}

fn assert_registry_column_constraints(
    registry_table: &str,
    table: &str,
    column: &str,
    expected_constraints: &str,
) {
    let column_block = registry_column_block(registry_table, column);
    let expected = format!("constraints: {expected_constraints}");
    assert!(
        column_block.contains(&expected),
        "schema registry table {table}.{column} must document {expected}"
    );
}

fn registry_column_block<'a>(registry_table: &'a str, column: &str) -> &'a str {
    let start_marker = format!("\n    {column}:\n");
    let start = registry_table
        .find(&start_marker)
        .unwrap_or_else(|| panic!("schema registry must document column {column}"));
    let remaining = &registry_table[start..];
    let mut end = remaining.len();
    for (offset, line) in remaining.char_indices().skip(1) {
        if offset > 0 && line == '\n' {
            let next = &remaining[offset..];
            if next.starts_with("\n    ") && !next.starts_with("\n      ") {
                end = offset;
                break;
            }
            if next.starts_with("\n  indexes:") {
                end = offset;
                break;
            }
        }
    }
    &remaining[..end]
}
