use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppRuntimeStore;
use sdkwork_claw_product::ports::{
    AppRuntimeStore, AppRuntimeSubject, CompleteAppRuntimeInvocationCommand,
    CreateAppRuntimeArtifactCommand, CreateAppRuntimeEventCommand,
    CreateAppRuntimeInvocationCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;

#[tokio::test]
async fn sqlite_app_runtime_store_records_invocations_events_and_artifacts() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_runtime_tables(&pool).await;
    seed_runtime_context(&pool, 30).await;
    let store = SqliteAppRuntimeStore::new(pool.clone());
    let subject = AppRuntimeSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let invocation = store
        .create_invocation(CreateAppRuntimeInvocationCommand {
            subject,
            invocation_uuid: "runtime-invocation-uuid-1".to_owned(),
            invocation_type: "chat_response".to_owned(),
            runtime: "claude_code".to_owned(),
            endpoint: Some("messages.create".to_owned()),
            status: "running".to_owned(),
            conversation_id: Some("chat-conversation-1".to_owned()),
            chat_turn_id: Some("chat-turn-1".to_owned()),
            chat_item_id: Some("chat-item-1".to_owned()),
            agent_session_id: Some("agent-session-1".to_owned()),
            agent_run_id: None,
            agent_run_step_id: None,
            request_id: Some("req-1".to_owned()),
            trace_id: Some("trace-1".to_owned()),
            model: Some("claude-sonnet-4-5".to_owned()),
            provider: Some("anthropic".to_owned()),
            tool_name: None,
            tool_call_id: None,
            cwd: Some("D:/javasource/spring-ai-plus".to_owned()),
            sandbox_policy: Some("workspace-write".to_owned()),
            approval_policy: Some("on-request".to_owned()),
            permission_mode: Some("default".to_owned()),
            streaming: true,
            request_json: json!({"messages":[{"role":"user","content":"hello"}]}),
            metadata: json!({"surface":"chat"}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("runtime-invocation-uuid-1", invocation.id);
    assert_eq!(1, invocation.invocation_no);
    assert_eq!("claude_code", invocation.runtime);
    assert!(invocation.streaming);

    let execution = store
        .get_invocation_execution(subject, "runtime-invocation-uuid-1".to_owned())
        .await
        .unwrap()
        .expect("runtime invocation execution snapshot should be visible to the owning user");
    assert_eq!("runtime-invocation-uuid-1", execution.item.id);
    assert_eq!(
        "hello",
        execution.request_json["messages"][0]["content"]
            .as_str()
            .unwrap()
    );
    assert_eq!("chat", execution.metadata["surface"].as_str().unwrap());

    let cross_user_execution = store
        .get_invocation_execution(
            AppRuntimeSubject {
                tenant_id: 10,
                organization_id: 20,
                user_id: 31,
            },
            "runtime-invocation-uuid-1".to_owned(),
        )
        .await
        .unwrap();
    assert!(
        cross_user_execution.is_none(),
        "runtime invocation execution snapshot must be scoped by the trusted user id"
    );

    let event = store
        .create_event(CreateAppRuntimeEventCommand {
            subject,
            invocation_id: "runtime-invocation-uuid-1".to_owned(),
            event_uuid: "runtime-event-uuid-1".to_owned(),
            event_type: "response.output_text.delta".to_owned(),
            event_source: "provider".to_owned(),
            payload_json: json!({"delta":"hello"}),
            text_delta: Some("hello".to_owned()),
            metadata: json!({"sequence":"first"}),
            requested_at: "2026-05-18 09:00:01".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("runtime-event-uuid-1", event.id);
    assert_eq!("runtime-invocation-uuid-1", event.invocation_id);
    assert_eq!(1, event.event_no);
    assert_eq!("hello", event.payload_json["delta"].as_str().unwrap());

    let artifact = store
        .create_artifact(CreateAppRuntimeArtifactCommand {
            subject,
            invocation_id: "runtime-invocation-uuid-1".to_owned(),
            artifact_uuid: "runtime-artifact-uuid-1".to_owned(),
            artifact_type: "file".to_owned(),
            name: Some("summary.md".to_owned()),
            mime_type: Some("text/markdown".to_owned()),
            content_text: Some("# Summary".to_owned()),
            content_json: json!({"kind":"markdown"}),
            storage_key: Some("runtime/runtime-invocation-uuid-1/summary.md".to_owned()),
            storage_url: None,
            sha256: Some("abc123".to_owned()),
            size_bytes: Some(9),
            metadata: json!({"source":"codex"}),
            requested_at: "2026-05-18 09:00:02".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("runtime-artifact-uuid-1", artifact.id);
    assert_eq!("summary.md", artifact.name.as_deref().unwrap());

    let completed = store
        .complete_invocation(CompleteAppRuntimeInvocationCommand {
            subject,
            invocation_id: "runtime-invocation-uuid-1".to_owned(),
            status: "completed".to_owned(),
            provider_response_id: Some("msg_123".to_owned()),
            provider_session_id: Some("session_123".to_owned()),
            provider_conversation_id: Some("conversation_123".to_owned()),
            provider_step_id: Some("step_123".to_owned()),
            finish_reason: Some("stop".to_owned()),
            latency_ms: Some(1200),
            ttft_ms: Some(200),
            exit_code: Some(0),
            error_type: None,
            error_code: None,
            error_message_masked: None,
            response_json: json!({"id":"msg_123"}),
            usage_json: json!({"inputTokens":10,"outputTokens":20}),
            metadata: json!({"completed":true}),
            requested_at: "2026-05-18 09:00:03".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("completed", completed.status);
    assert_eq!(
        "msg_123",
        completed.provider_response_id.as_deref().unwrap()
    );
    assert_eq!(1200, completed.latency_ms.unwrap());
    assert_eq!(
        "2026-05-18 09:00:03",
        completed.completed_at.as_deref().unwrap()
    );

    let invocations = store
        .list_invocations(
            subject,
            sdkwork_claw_product::ports::AppRuntimeInvocationQuery {
                page: 1,
                page_size: 20,
                conversation_id: Some("chat-conversation-1".to_owned()),
                chat_turn_id: None,
                agent_session_id: None,
                runtime: None,
                status: None,
            },
        )
        .await
        .unwrap();
    assert_eq!(1, invocations.items.len());
    assert_eq!("runtime-invocation-uuid-1", invocations.items[0].id);

    let events = store
        .list_events(subject, "runtime-invocation-uuid-1".to_owned(), 1, 20)
        .await
        .unwrap();
    assert_eq!(1, events.items.len());
    assert_eq!("runtime-event-uuid-1", events.items[0].id);

    let artifacts = store
        .list_artifacts(subject, "runtime-invocation-uuid-1".to_owned(), 1, 20)
        .await
        .unwrap();
    assert_eq!(1, artifacts.items.len());
    assert_eq!("runtime-artifact-uuid-1", artifacts.items[0].id);

    let invocation_row = sqlx::query(
        "SELECT request_json, response_json, usage_json FROM ai_runtime_invocation WHERE uuid = 'runtime-invocation-uuid-1'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(invocation_row
        .get::<String, _>("request_json")
        .contains("messages"));
    assert!(invocation_row
        .get::<String, _>("response_json")
        .contains("msg_123"));
    assert!(invocation_row
        .get::<String, _>("usage_json")
        .contains("inputTokens"));
}

#[tokio::test]
async fn sqlite_app_runtime_store_rejects_context_outside_trusted_user_scope() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_runtime_tables(&pool).await;
    seed_runtime_context(&pool, 31).await;
    let store = SqliteAppRuntimeStore::new(pool);
    let subject = AppRuntimeSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let conversation_error = store
        .create_invocation(CreateAppRuntimeInvocationCommand {
            subject,
            invocation_uuid: "runtime-invocation-uuid-cross-chat".to_owned(),
            invocation_type: "chat_response".to_owned(),
            runtime: "codex".to_owned(),
            endpoint: Some("responses.create".to_owned()),
            status: "running".to_owned(),
            conversation_id: Some("chat-conversation-1".to_owned()),
            chat_turn_id: None,
            chat_item_id: None,
            agent_session_id: None,
            agent_run_id: None,
            agent_run_step_id: None,
            request_id: Some("request-cross-chat".to_owned()),
            trace_id: None,
            model: Some("gpt-5.1-codex".to_owned()),
            provider: Some("openai".to_owned()),
            tool_name: None,
            tool_call_id: None,
            cwd: None,
            sandbox_policy: None,
            approval_policy: None,
            permission_mode: None,
            streaming: true,
            request_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(conversation_error.is_not_found());

    let agent_error = store
        .create_invocation(CreateAppRuntimeInvocationCommand {
            subject,
            invocation_uuid: "runtime-invocation-uuid-cross-agent".to_owned(),
            invocation_type: "agent_step".to_owned(),
            runtime: "codex".to_owned(),
            endpoint: Some("agent.run".to_owned()),
            status: "running".to_owned(),
            conversation_id: None,
            chat_turn_id: None,
            chat_item_id: None,
            agent_session_id: Some("agent-session-1".to_owned()),
            agent_run_id: Some("agent-run-1".to_owned()),
            agent_run_step_id: Some("agent-step-1".to_owned()),
            request_id: Some("request-cross-agent".to_owned()),
            trace_id: None,
            model: Some("gpt-5.1-codex".to_owned()),
            provider: Some("openai".to_owned()),
            tool_name: Some("codex".to_owned()),
            tool_call_id: None,
            cwd: None,
            sandbox_policy: None,
            approval_policy: None,
            permission_mode: None,
            streaming: true,
            request_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:01:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(agent_error.is_not_found());
}

#[tokio::test]
async fn sqlite_app_runtime_store_rejects_agent_step_without_trusted_user_owner() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_runtime_tables(&pool).await;
    seed_runtime_context(&pool, 30).await;
    let store = SqliteAppRuntimeStore::new(pool.clone());
    let subject = AppRuntimeSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    sqlx::query(
        r#"
        UPDATE ai_agent_run_step
        SET user_id = NULL
        WHERE tenant_id = 10
          AND organization_id = 20
          AND uuid = 'agent-step-1'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let nullable_step_error = store
        .create_invocation(CreateAppRuntimeInvocationCommand {
            subject,
            invocation_uuid: "runtime-invocation-uuid-null-agent-step-user".to_owned(),
            invocation_type: "agent_step".to_owned(),
            runtime: "codex".to_owned(),
            endpoint: Some("agent.run".to_owned()),
            status: "running".to_owned(),
            conversation_id: None,
            chat_turn_id: None,
            chat_item_id: None,
            agent_session_id: Some("agent-session-1".to_owned()),
            agent_run_id: Some("agent-run-1".to_owned()),
            agent_run_step_id: Some("agent-step-1".to_owned()),
            request_id: Some("request-null-agent-step-user".to_owned()),
            trace_id: None,
            model: Some("gpt-5.1-codex".to_owned()),
            provider: Some("openai".to_owned()),
            tool_name: Some("codex".to_owned()),
            tool_call_id: None,
            cwd: None,
            sandbox_policy: None,
            approval_policy: None,
            permission_mode: None,
            streaming: true,
            request_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:01:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(nullable_step_error.is_not_found());
}

#[tokio::test]
async fn sqlite_app_runtime_store_rejects_deleted_string_lifecycle_contexts() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_runtime_tables(&pool).await;
    seed_runtime_context(&pool, 30).await;
    let store = SqliteAppRuntimeStore::new(pool.clone());
    let subject = AppRuntimeSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    sqlx::query(
        r#"
        UPDATE ai_chat_conversation
        SET status = 'deleted'
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND conversation_code = 'chat-conversation-1'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let deleted_conversation_error = store
        .create_invocation(CreateAppRuntimeInvocationCommand {
            subject,
            invocation_uuid: "runtime-invocation-uuid-deleted-chat".to_owned(),
            invocation_type: "chat_response".to_owned(),
            runtime: "codex".to_owned(),
            endpoint: Some("responses.create".to_owned()),
            status: "running".to_owned(),
            conversation_id: Some("chat-conversation-1".to_owned()),
            chat_turn_id: None,
            chat_item_id: None,
            agent_session_id: None,
            agent_run_id: None,
            agent_run_step_id: None,
            request_id: Some("request-deleted-chat".to_owned()),
            trace_id: None,
            model: Some("gpt-5.1-codex".to_owned()),
            provider: Some("openai".to_owned()),
            tool_name: None,
            tool_call_id: None,
            cwd: None,
            sandbox_policy: None,
            approval_policy: None,
            permission_mode: None,
            streaming: true,
            request_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(deleted_conversation_error.is_not_found());

    sqlx::query(
        r#"
        UPDATE ai_chat_conversation
        SET status = 'active'
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND conversation_code = 'chat-conversation-1'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        UPDATE ai_agent_run_step
        SET status = 'deleted'
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND uuid = 'agent-step-1'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let deleted_agent_step_error = store
        .create_invocation(CreateAppRuntimeInvocationCommand {
            subject,
            invocation_uuid: "runtime-invocation-uuid-deleted-agent-step".to_owned(),
            invocation_type: "agent_step".to_owned(),
            runtime: "codex".to_owned(),
            endpoint: Some("agent.run".to_owned()),
            status: "running".to_owned(),
            conversation_id: None,
            chat_turn_id: None,
            chat_item_id: None,
            agent_session_id: Some("agent-session-1".to_owned()),
            agent_run_id: Some("agent-run-1".to_owned()),
            agent_run_step_id: Some("agent-step-1".to_owned()),
            request_id: Some("request-deleted-agent-step".to_owned()),
            trace_id: None,
            model: Some("gpt-5.1-codex".to_owned()),
            provider: Some("openai".to_owned()),
            tool_name: Some("codex".to_owned()),
            tool_call_id: None,
            cwd: None,
            sandbox_policy: None,
            approval_policy: None,
            permission_mode: None,
            streaming: true,
            request_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:01:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(deleted_agent_step_error.is_not_found());
}

async fn create_runtime_tables(pool: &sqlx::SqlitePool) {
    for statement in RUNTIME_SCHEMA.split(';') {
        let statement = statement.trim();
        if !statement.is_empty() {
            sqlx::query(statement).execute(pool).await.unwrap();
        }
    }
}

async fn seed_runtime_context(pool: &sqlx::SqlitePool, user_id: i64) {
    sqlx::query(
        r#"
        INSERT INTO ai_chat_conversation (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            status,
            created_at,
            updated_at,
            metadata,
            conversation_code,
            title,
            source_surface
        )
        VALUES (?1, 10, 20, ?2, 'active', '2026-05-18 08:00:00', '2026-05-18 08:00:00', '{}', 'chat-conversation-1', 'Source conversation', 'chat')
        "#,
    )
    .bind(format!("chat-conversation-uuid-{user_id}"))
    .bind(user_id)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_chat_turn (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            conversation_id,
            turn_no,
            status,
            created_at,
            updated_at,
            metadata
        )
        SELECT 'chat-turn-1', tenant_id, organization_id, user_id, id, 1, 'completed', '2026-05-18 08:01:00', '2026-05-18 08:01:00', '{}'
        FROM ai_chat_conversation
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = ?1
          AND conversation_code = 'chat-conversation-1'
        "#,
    )
    .bind(user_id)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_chat_item (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            conversation_id,
            turn_id,
            sequence_no,
            item_type,
            role,
            direction,
            status,
            content_text,
            created_at,
            metadata
        )
        SELECT 'chat-item-1', c.tenant_id, c.organization_id, c.user_id, c.id, t.id, 1, 'message', 'user', 'input', 'completed', 'hello', '2026-05-18 08:01:00', '{}'
        FROM ai_chat_conversation c
        INNER JOIN ai_chat_turn t ON t.conversation_id = c.id
        WHERE c.tenant_id = 10
          AND c.organization_id = 20
          AND c.user_id = ?1
          AND c.conversation_code = 'chat-conversation-1'
          AND t.uuid = 'chat-turn-1'
        "#,
    )
    .bind(user_id)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_agent_session (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_id,
            agent_version_id,
            session_code,
            title,
            session_kind,
            source_surface,
            status,
            runtime,
            default_model,
            run_count,
            step_count,
            tool_call_count,
            created_at,
            updated_at,
            metadata
        )
        VALUES (?1, 10, 20, ?2, '101', '201', 'agent-session-1', 'Agent session', 'coding', 'chat', 'active', 'codex', 'gpt-5.1-codex', 0, 0, 0, '2026-05-18 08:00:00', '2026-05-18 08:00:00', '{}')
        "#,
    )
    .bind(format!("agent-session-uuid-{user_id}"))
    .bind(user_id)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_agent_run (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            request_id,
            trace_id,
            status,
            created_at,
            metadata,
            agent_id,
            agent_version_id,
            agent_session_id,
            runtime,
            model,
            run_uuid,
            run_status,
            source_surface,
            execution_mode,
            started_at,
            total_steps
        )
        VALUES (?1, 10, 20, ?2, ?3, NULL, 'active', '2026-05-18 08:02:00', '{}', 101, 201, 'agent-session-1', 'codex', 'gpt-5.1-codex', 'agent-run-1', 'running', 'chat', 'interactive', '2026-05-18 08:02:00', 1)
        "#,
    )
    .bind(format!("agent-run-uuid-{user_id}"))
    .bind(user_id)
    .bind(format!("agent-run-request-{user_id}"))
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_agent_run_step (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            status,
            created_at,
            metadata,
            run_id,
            agent_id,
            agent_version_id,
            step_index,
            step_type,
            step_status
        )
        SELECT 'agent-step-1', tenant_id, organization_id, user_id, 'active', '2026-05-18 08:03:00', '{}', id, 101, 201, 1, 2, 'completed'
        FROM ai_agent_run
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = ?1
          AND run_uuid = 'agent-run-1'
        "#,
    )
    .bind(user_id)
    .execute(pool)
    .await
    .unwrap();
}

const RUNTIME_SCHEMA: &str = r#"
CREATE TABLE ai_chat_conversation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    metadata TEXT NOT NULL,
    conversation_code TEXT NOT NULL,
    title TEXT NOT NULL,
    source_surface TEXT NOT NULL
);
CREATE TABLE ai_chat_turn (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    conversation_id INTEGER NOT NULL,
    turn_no INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    metadata TEXT NOT NULL
);
CREATE TABLE ai_chat_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    conversation_id INTEGER NOT NULL,
    turn_id INTEGER,
    sequence_no INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    role TEXT,
    direction TEXT NOT NULL,
    status TEXT NOT NULL,
    content_text TEXT,
    created_at TEXT NOT NULL,
    metadata TEXT NOT NULL
);
CREATE TABLE ai_agent_session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    agent_id TEXT NOT NULL,
    agent_version_id TEXT,
    session_code TEXT NOT NULL,
    title TEXT NOT NULL,
    session_kind TEXT NOT NULL,
    source_surface TEXT NOT NULL,
    status TEXT NOT NULL,
    runtime TEXT,
    default_model TEXT,
    run_count INTEGER NOT NULL DEFAULT 0,
    step_count INTEGER NOT NULL DEFAULT 0,
    tool_call_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE ai_agent_run (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    request_id TEXT NOT NULL,
    trace_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT NOT NULL DEFAULT '{}',
    agent_id INTEGER NOT NULL,
    agent_version_id INTEGER NOT NULL,
    agent_session_id TEXT,
    runtime TEXT,
    model TEXT,
    run_uuid TEXT NOT NULL,
    run_status TEXT NOT NULL,
    source_surface TEXT,
    execution_mode TEXT,
    started_at TEXT,
    total_steps INTEGER
);
CREATE TABLE ai_agent_run_step (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT NOT NULL DEFAULT '{}',
    run_id INTEGER NOT NULL,
    agent_id INTEGER,
    agent_version_id INTEGER,
    step_index INTEGER NOT NULL,
    step_type INTEGER NOT NULL,
    step_status TEXT NOT NULL
);
CREATE TABLE ai_runtime_invocation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    conversation_id TEXT,
    chat_turn_id TEXT,
    chat_item_id TEXT,
    agent_session_id TEXT,
    agent_run_id TEXT,
    agent_run_step_id TEXT,
    invocation_no INTEGER NOT NULL,
    invocation_type TEXT NOT NULL,
    runtime TEXT NOT NULL,
    endpoint TEXT,
    attempt_no INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL,
    request_id TEXT,
    trace_id TEXT,
    provider_response_id TEXT,
    provider_session_id TEXT,
    provider_conversation_id TEXT,
    provider_step_id TEXT,
    model TEXT,
    provider TEXT,
    tool_name TEXT,
    tool_call_id TEXT,
    cwd TEXT,
    sandbox_policy TEXT,
    approval_policy TEXT,
    permission_mode TEXT,
    streaming INTEGER NOT NULL DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    latency_ms INTEGER,
    ttft_ms INTEGER,
    exit_code INTEGER,
    finish_reason TEXT,
    error_type TEXT,
    error_code TEXT,
    error_message_masked TEXT,
    request_json TEXT,
    response_json TEXT,
    usage_json TEXT,
    created_at TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE ai_runtime_invocation_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    invocation_id INTEGER NOT NULL,
    conversation_id TEXT,
    chat_turn_id TEXT,
    agent_session_id TEXT,
    agent_run_id TEXT,
    agent_run_step_id TEXT,
    event_no INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    event_source TEXT NOT NULL,
    payload_json TEXT,
    text_delta TEXT,
    created_at TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE ai_runtime_artifact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    conversation_id TEXT,
    chat_turn_id TEXT,
    message_id TEXT,
    chat_item_id TEXT,
    agent_session_id TEXT,
    agent_run_id TEXT,
    agent_run_step_id TEXT,
    runtime_invocation_id TEXT,
    artifact_type TEXT NOT NULL,
    name TEXT,
    mime_type TEXT,
    content_text TEXT,
    content_json TEXT,
    storage_key TEXT,
    storage_url TEXT,
    sha256 TEXT,
    size_bytes INTEGER,
    created_at TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}'
);
"#;
