use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppAgentSessionStore;
use sdkwork_claw_product::ports::{
    AppAgentSessionStore, AppAgentSessionSubject, CreateAppAgentSessionCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_app_agent_session_store_creates_lists_and_gets_sessions() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_session_tables(&pool).await;
    seed_memory_space(&pool, 30, "memory-space-1").await;
    let store = SqliteAppAgentSessionStore::new(pool);
    let subject = AppAgentSessionSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let session = store
        .create_session(CreateAppAgentSessionCommand {
            subject,
            agent_id: "agent-1".to_owned(),
            agent_version_id: Some("agent-version-1".to_owned()),
            session_uuid: "agent-session-uuid-1".to_owned(),
            title: Some("Coding session".to_owned()),
            session_kind: "coding".to_owned(),
            source_surface: "chat".to_owned(),
            chat_conversation_id: Some("chat-conversation-1".to_owned()),
            memory_space_id: Some("memory-space-1".to_owned()),
            runtime: Some("codex".to_owned()),
            cwd: Some("D:/repo".to_owned()),
            sandbox_policy: Some("workspace-write".to_owned()),
            approval_policy: Some("on-request".to_owned()),
            permission_mode: Some("default".to_owned()),
            default_model: Some("gpt-5.1-codex".to_owned()),
            metadata: json!({"client":"test"}),
            requested_at: "2026-05-18 08:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("agent-session-uuid-1", session.id);
    assert_eq!("agent-1", session.agent_id);
    assert_eq!(
        "agent-version-1",
        session.agent_version_id.as_deref().unwrap()
    );
    assert_eq!("coding", session.session_kind);
    assert_eq!(
        "memory-space-1",
        session.memory_space_id.as_deref().unwrap()
    );

    let listed = store
        .list_sessions(subject, "agent-1".to_owned(), 1, 20)
        .await
        .unwrap();
    assert_eq!(1, listed.items.len());
    assert_eq!("agent-session-uuid-1", listed.items[0].id);

    let loaded = store
        .get_session(subject, "agent-session-uuid-1".to_owned())
        .await
        .unwrap()
        .unwrap();
    assert_eq!("agent-session-uuid-1", loaded.id);
    assert_eq!("codex", loaded.runtime.as_deref().unwrap());
    assert_eq!("workspace-write", loaded.sandbox_policy.as_deref().unwrap());
    assert_eq!(None, loaded.last_run_id);
    assert_eq!(None, loaded.last_step_id);
    assert_eq!(None, loaded.last_active_at);
    assert_eq!(0, loaded.tool_call_count);
}

#[tokio::test]
async fn sqlite_app_agent_session_store_rejects_memory_space_outside_trusted_user_scope() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_session_tables(&pool).await;
    sqlx::query(
        r#"
        INSERT INTO ai_memory_space (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            space_type,
            owner_id,
            title,
            status,
            created_at,
            updated_at,
            metadata
        )
        VALUES ('memory-space-other-user', 10, 20, 31, 'agent', 'agent-1', 'Other user agent memory', 'active', '2026-05-18 08:00:00', '2026-05-18 08:00:00', '{}')
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    let store = SqliteAppAgentSessionStore::new(pool);
    let subject = AppAgentSessionSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let error = store
        .create_session(CreateAppAgentSessionCommand {
            subject,
            agent_id: "agent-1".to_owned(),
            agent_version_id: Some("agent-version-1".to_owned()),
            session_uuid: "agent-session-uuid-1".to_owned(),
            title: Some("Should fail".to_owned()),
            session_kind: "coding".to_owned(),
            source_surface: "chat".to_owned(),
            chat_conversation_id: None,
            memory_space_id: Some("memory-space-other-user".to_owned()),
            runtime: Some("codex".to_owned()),
            cwd: None,
            sandbox_policy: None,
            approval_policy: None,
            permission_mode: None,
            default_model: None,
            metadata: json!({}),
            requested_at: "2026-05-18 08:00:00".to_owned(),
        })
        .await
        .unwrap_err();

    assert!(error.is_not_found());
}

async fn seed_memory_space(pool: &sqlx::SqlitePool, user_id: i64, space_id: &str) {
    sqlx::query(
        r#"
        INSERT INTO ai_memory_space (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            space_type,
            owner_id,
            title,
            status,
            created_at,
            updated_at,
            metadata
        )
        VALUES (?1, 10, 20, ?2, 'agent', 'agent-1', 'Agent memory', 'active', '2026-05-18 08:00:00', '2026-05-18 08:00:00', '{}')
        "#,
    )
    .bind(space_id)
    .bind(user_id)
    .execute(pool)
    .await
    .unwrap();
}

async fn create_agent_session_tables(pool: &sqlx::SqlitePool) {
    for statement in AGENT_SESSION_SCHEMA.split(';') {
        let statement = statement.trim();
        if !statement.is_empty() {
            sqlx::query(statement).execute(pool).await.unwrap();
        }
    }
}

const AGENT_SESSION_SCHEMA: &str = r#"
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
    chat_conversation_id TEXT,
    memory_space_id TEXT,
    runtime TEXT,
    cwd TEXT,
    sandbox_policy TEXT,
    approval_policy TEXT,
    permission_mode TEXT,
    default_model TEXT,
    last_run_id TEXT,
    last_step_id INTEGER,
    last_active_at TEXT,
    run_count INTEGER NOT NULL DEFAULT 0,
    step_count INTEGER NOT NULL DEFAULT 0,
    tool_call_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    metadata TEXT NOT NULL
);
CREATE UNIQUE INDEX uk_ai_agent_session_code ON ai_agent_session (tenant_id, organization_id, user_id, session_code);
CREATE INDEX idx_ai_agent_session_agent_updated ON ai_agent_session (tenant_id, organization_id, agent_id, user_id, updated_at, id);
CREATE TABLE ai_memory_space (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    space_type TEXT NOT NULL,
    owner_type TEXT,
    owner_id TEXT,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    metadata TEXT NOT NULL
);
"#;
