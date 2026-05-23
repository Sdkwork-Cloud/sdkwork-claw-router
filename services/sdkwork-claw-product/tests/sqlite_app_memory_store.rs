use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppMemoryStore;
use sdkwork_claw_product::ports::{
    AppMemoryStore, AppMemorySubject, CreateAppMemoryEntryCommand, CreateAppMemorySpaceCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;

#[tokio::test]
async fn sqlite_app_memory_store_creates_spaces_entries_and_events() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_memory_tables(&pool).await;
    seed_memory_source_context(&pool, 30).await;
    let store = SqliteAppMemoryStore::new(pool.clone());
    let subject = AppMemorySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let space = store
        .create_space(CreateAppMemorySpaceCommand {
            subject,
            space_uuid: "memory-space-uuid-1".to_owned(),
            title: "Project coding memory".to_owned(),
            space_type: "project".to_owned(),
            owner_type: Some("agent".to_owned()),
            owner_id: Some("agent-1".to_owned()),
            memory_enabled: true,
            auto_extract_enabled: true,
            auto_recall_enabled: true,
            review_required: false,
            max_injected_tokens: Some(4096),
            retention_policy: json!({"ttlDays":365}),
            sensitivity_policy: json!({"level":"standard"}),
            metadata: json!({"client":"test"}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("memory-space-uuid-1", space.id);
    assert_eq!("project", space.space_type);
    assert_eq!("Project coding memory", space.title);
    assert!(space.memory_enabled);

    let entry = store
        .create_entry(CreateAppMemoryEntryCommand {
            subject,
            space_id: "memory-space-uuid-1".to_owned(),
            entry_uuid: "memory-entry-uuid-1".to_owned(),
            event_uuid: "memory-event-uuid-1".to_owned(),
            memory_type: "preference".to_owned(),
            subject_type: Some("user".to_owned()),
            subject_key: Some("user-30".to_owned()),
            content_text: "Prefers concise implementation plans and direct verification evidence."
                .to_owned(),
            content_json: json!({}),
            source_kind: "chat".to_owned(),
            source_conversation_id: Some("chat-conversation-1".to_owned()),
            source_turn_id: Some("chat-turn-1".to_owned()),
            source_item_id: None,
            source_invocation_id: None,
            importance_score: Some("0.9000".to_owned()),
            confidence_score: Some("0.9500".to_owned()),
            sensitivity_level: "standard".to_owned(),
            trust_level: "observed".to_owned(),
            status: "active".to_owned(),
            metadata: json!({"origin":"manual"}),
            requested_at: "2026-05-18 09:01:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("memory-entry-uuid-1", entry.id);
    assert_eq!("memory-space-uuid-1", entry.space_id);
    assert_eq!("preference", entry.memory_type);
    assert_eq!(
        "Prefers concise implementation plans and direct verification evidence.",
        entry.content
    );

    let spaces = store.list_spaces(subject, 1, 20).await.unwrap();
    assert_eq!(1, spaces.items.len());
    assert_eq!("memory-space-uuid-1", spaces.items[0].id);
    assert_eq!(1, spaces.items[0].entry_count);

    let entries = store
        .list_entries(subject, "memory-space-uuid-1".to_owned(), 1, 20)
        .await
        .unwrap();
    assert_eq!(1, entries.items.len());
    assert_eq!("memory-entry-uuid-1", entries.items[0].id);
    assert_eq!(
        "chat-conversation-1",
        entries.items[0].source_conversation_id.as_deref().unwrap()
    );

    let event = sqlx::query(
        "SELECT uuid, event_type, actor_type, actor_id, conversation_id, turn_id FROM ai_memory_event WHERE uuid = 'memory-event-uuid-1'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("memory.created", event.get::<String, _>("event_type"));
    assert_eq!("user", event.get::<String, _>("actor_type"));
    assert_eq!("30", event.get::<String, _>("actor_id"));
    assert_eq!(
        "chat-conversation-1",
        event.get::<String, _>("conversation_id")
    );
    assert_eq!("chat-turn-1", event.get::<String, _>("turn_id"));
}

#[tokio::test]
async fn sqlite_app_memory_store_scopes_spaces_entries_and_events_by_trusted_user() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_memory_tables(&pool).await;
    let store = SqliteAppMemoryStore::new(pool.clone());
    let owner = AppMemorySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };
    let other_user = AppMemorySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 31,
    };

    store
        .create_space(CreateAppMemorySpaceCommand {
            subject: owner,
            space_uuid: "memory-space-uuid-1".to_owned(),
            title: "Private coding memory".to_owned(),
            space_type: "user".to_owned(),
            owner_type: None,
            owner_id: None,
            memory_enabled: true,
            auto_extract_enabled: true,
            auto_recall_enabled: true,
            review_required: false,
            max_injected_tokens: Some(2048),
            retention_policy: json!({}),
            sensitivity_policy: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap();

    store
        .create_entry(CreateAppMemoryEntryCommand {
            subject: owner,
            space_id: "memory-space-uuid-1".to_owned(),
            entry_uuid: "memory-entry-uuid-1".to_owned(),
            event_uuid: "memory-event-uuid-1".to_owned(),
            memory_type: "fact".to_owned(),
            subject_type: Some("user".to_owned()),
            subject_key: Some("user-30".to_owned()),
            content_text: "User 30 private memory.".to_owned(),
            content_json: json!({}),
            source_kind: "manual".to_owned(),
            source_conversation_id: None,
            source_turn_id: None,
            source_item_id: None,
            source_invocation_id: None,
            importance_score: None,
            confidence_score: None,
            sensitivity_level: "standard".to_owned(),
            trust_level: "observed".to_owned(),
            status: "active".to_owned(),
            metadata: json!({}),
            requested_at: "2026-05-18 09:01:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(
        1,
        store.list_spaces(owner, 1, 20).await.unwrap().items.len()
    );
    assert_eq!(
        0,
        store
            .list_spaces(other_user, 1, 20)
            .await
            .unwrap()
            .items
            .len()
    );
    assert!(store
        .get_space(other_user, "memory-space-uuid-1".to_owned())
        .await
        .unwrap()
        .is_none());
    assert!(store
        .get_entry(other_user, "memory-entry-uuid-1".to_owned())
        .await
        .unwrap()
        .is_none());
    assert!(store
        .list_entries(other_user, "memory-space-uuid-1".to_owned(), 1, 20)
        .await
        .unwrap_err()
        .is_not_found());

    let row = sqlx::query(
        "SELECT s.user_id AS space_user_id, e.user_id AS entry_user_id, ev.user_id AS event_user_id
         FROM ai_memory_space s
         JOIN ai_memory_entry e ON e.space_id = s.id
         JOIN ai_memory_event ev ON ev.memory_id = e.id
         WHERE s.uuid = 'memory-space-uuid-1'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(30_i64, row.get::<i64, _>("space_user_id"));
    assert_eq!(30_i64, row.get::<i64, _>("entry_user_id"));
    assert_eq!(30_i64, row.get::<i64, _>("event_user_id"));
}

#[tokio::test]
async fn sqlite_app_memory_store_rejects_source_context_outside_trusted_user_scope() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_memory_tables(&pool).await;
    seed_memory_source_context(&pool, 31).await;
    let store = SqliteAppMemoryStore::new(pool.clone());
    let subject = AppMemorySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    store
        .create_space(CreateAppMemorySpaceCommand {
            subject,
            space_uuid: "memory-space-uuid-1".to_owned(),
            title: "Private memory".to_owned(),
            space_type: "user".to_owned(),
            owner_type: None,
            owner_id: None,
            memory_enabled: true,
            auto_extract_enabled: true,
            auto_recall_enabled: true,
            review_required: false,
            max_injected_tokens: None,
            retention_policy: json!({}),
            sensitivity_policy: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap();

    let conversation_error = store
        .create_entry(CreateAppMemoryEntryCommand {
            subject,
            space_id: "memory-space-uuid-1".to_owned(),
            entry_uuid: "memory-entry-uuid-cross-conversation".to_owned(),
            event_uuid: "memory-event-uuid-cross-conversation".to_owned(),
            memory_type: "fact".to_owned(),
            subject_type: Some("user".to_owned()),
            subject_key: Some("user-30".to_owned()),
            content_text: "Must not cite another user's conversation.".to_owned(),
            content_json: json!({}),
            source_kind: "chat".to_owned(),
            source_conversation_id: Some("chat-conversation-1".to_owned()),
            source_turn_id: None,
            source_item_id: None,
            source_invocation_id: None,
            importance_score: None,
            confidence_score: None,
            sensitivity_level: "standard".to_owned(),
            trust_level: "observed".to_owned(),
            status: "active".to_owned(),
            metadata: json!({}),
            requested_at: "2026-05-18 09:01:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(conversation_error.is_not_found());

    seed_memory_source_context(&pool, 30).await;
    let runtime_error = store
        .create_entry(CreateAppMemoryEntryCommand {
            subject,
            space_id: "memory-space-uuid-1".to_owned(),
            entry_uuid: "memory-entry-uuid-cross-runtime".to_owned(),
            event_uuid: "memory-event-uuid-cross-runtime".to_owned(),
            memory_type: "fact".to_owned(),
            subject_type: Some("user".to_owned()),
            subject_key: Some("user-30".to_owned()),
            content_text: "Must not cite another user's runtime invocation.".to_owned(),
            content_json: json!({}),
            source_kind: "runtime".to_owned(),
            source_conversation_id: None,
            source_turn_id: None,
            source_item_id: None,
            source_invocation_id: Some("runtime-invocation-other-user".to_owned()),
            importance_score: None,
            confidence_score: None,
            sensitivity_level: "standard".to_owned(),
            trust_level: "observed".to_owned(),
            status: "active".to_owned(),
            metadata: json!({}),
            requested_at: "2026-05-18 09:02:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(runtime_error.is_not_found());
}

async fn create_memory_tables(pool: &sqlx::SqlitePool) {
    for statement in MEMORY_SCHEMA.split(';') {
        let statement = statement.trim();
        if !statement.is_empty() {
            sqlx::query(statement).execute(pool).await.unwrap();
        }
    }
}

async fn seed_memory_source_context(pool: &sqlx::SqlitePool, user_id: i64) {
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
        INSERT INTO ai_runtime_invocation (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            conversation_id,
            chat_turn_id,
            chat_item_id,
            invocation_no,
            invocation_type,
            runtime,
            status,
            created_at
        )
        VALUES (?1, 10, 20, ?2, 'chat-conversation-1', 'chat-turn-1', 'chat-item-1', 1, 'chat_response', 'codex', 'completed', '2026-05-18 08:02:00')
        "#,
    )
    .bind(if user_id == 30 {
        "runtime-invocation-1"
    } else {
        "runtime-invocation-other-user"
    })
    .bind(user_id)
    .execute(pool)
    .await
    .unwrap();
}

const MEMORY_SCHEMA: &str = r#"
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
    memory_enabled INTEGER NOT NULL DEFAULT 1,
    auto_extract_enabled INTEGER NOT NULL DEFAULT 0,
    auto_recall_enabled INTEGER NOT NULL DEFAULT 1,
    review_required INTEGER NOT NULL DEFAULT 0,
    max_injected_tokens INTEGER,
    retention_policy TEXT,
    sensitivity_policy TEXT,
    entry_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    metadata TEXT NOT NULL
);
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
CREATE TABLE ai_runtime_invocation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    conversation_id TEXT,
    chat_turn_id TEXT,
    chat_item_id TEXT,
    invocation_no INTEGER NOT NULL,
    invocation_type TEXT NOT NULL,
    runtime TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE ai_memory_entry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    space_id INTEGER NOT NULL,
    memory_code TEXT NOT NULL,
    memory_type TEXT NOT NULL,
    subject_type TEXT,
    subject_key TEXT,
    content_text TEXT NOT NULL,
    content_json TEXT,
    source_kind TEXT NOT NULL,
    source_conversation_id TEXT,
    source_turn_id TEXT,
    source_item_id TEXT,
    source_invocation_id TEXT,
    importance_score TEXT,
    confidence_score TEXT,
    sensitivity_level TEXT NOT NULL,
    trust_level TEXT NOT NULL,
    status TEXT NOT NULL,
    recall_count INTEGER NOT NULL DEFAULT 0,
    version_no INTEGER NOT NULL DEFAULT 1,
    created_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    metadata TEXT NOT NULL
);
CREATE TABLE ai_memory_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    memory_id INTEGER,
    space_id INTEGER,
    event_type TEXT NOT NULL,
    actor_type TEXT NOT NULL,
    actor_id TEXT,
    conversation_id TEXT,
    turn_id TEXT,
    invocation_id TEXT,
    before_json TEXT,
    after_json TEXT,
    decision_reason TEXT,
    created_at TEXT NOT NULL,
    metadata TEXT NOT NULL
);
"#;
