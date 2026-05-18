use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppAgentRegistryStore;
use sdkwork_claw_product::ports::{
    AppAgentRegistryQuery, AppAgentRegistryStore, AppAgentRegistrySubject, CreateAppAgentCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;

#[tokio::test]
async fn sqlite_app_agent_registry_store_creates_agent_with_default_version_and_policy_summary() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_tables(&pool).await;
    let store = SqliteAppAgentRegistryStore::new(pool.clone());
    let subject = AppAgentRegistrySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let item = store
        .create_agent(CreateAppAgentCommand {
            subject,
            agent_uuid: "agent-uuid-001".to_owned(),
            version_uuid: "agent-version-uuid-001".to_owned(),
            idempotency_key: "create-product-studio-agent".to_owned(),
            request_id: "request-product-studio-agent".to_owned(),
            agent_code: "product-studio-agent".to_owned(),
            name: "Product Studio Agent".to_owned(),
            description: Some("Creates product launch assets".to_owned()),
            model: Some("gpt-5.1".to_owned()),
            system_prompt: Some("You are a precise launch content agent.".to_owned()),
            tool_policy: json!({ "enabled": true }),
            memory_policy: json!({ "enabled": true }),
            mcp_policy: json!({ "servers": ["filesystem"] }),
            skill_policy: json!({ "skills": ["image.generate"] }),
            runtime_policy: json!({ "executionMode": "interactive" }),
            requested_at: "2026-05-17 08:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("1", item.id);
    assert_eq!("product-studio-agent", item.code);
    assert_eq!("Product Studio Agent", item.name);
    assert_eq!("private", item.visibility);
    assert_eq!("active", item.status);
    assert_eq!("1", item.default_version.id);
    assert_eq!(1, item.default_version.version_no);
    assert_eq!("draft", item.default_version.release_status);
    assert_eq!("gpt-5.1", item.default_version.model.as_deref().unwrap());
    assert_eq!(true, item.capabilities.memory_enabled);
    assert_eq!(1, item.capabilities.mcp_server_count);
    assert_eq!(1, item.capabilities.skill_binding_count);

    let agent_row = sqlx::query(
        r#"
        SELECT uuid, tenant_id, organization_id, owner_user_id, agent_code, name, default_version_id, metadata
        FROM ai_agent
        WHERE id = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("agent-uuid-001", agent_row.get::<String, _>("uuid"));
    assert_eq!(10_i64, agent_row.get::<i64, _>("tenant_id"));
    assert_eq!(20_i64, agent_row.get::<i64, _>("organization_id"));
    assert_eq!(30_i64, agent_row.get::<i64, _>("owner_user_id"));
    assert_eq!(
        "product-studio-agent",
        agent_row.get::<String, _>("agent_code")
    );
    assert_eq!(1_i64, agent_row.get::<i64, _>("default_version_id"));
    let agent_metadata =
        serde_json::from_str::<serde_json::Value>(&agent_row.get::<String, _>("metadata")).unwrap();
    assert_eq!(
        "create-product-studio-agent",
        agent_metadata["idempotencyKey"]
    );
    assert_eq!("request-product-studio-agent", agent_metadata["requestId"]);
    assert_eq!("app-agent-registry", agent_metadata["createdBy"]);

    let version_row = sqlx::query(
        r#"
        SELECT uuid, agent_id, version_no, release_status, system_prompt, model_policy, memory_policy, mcp_policy, skill_policy, runtime_policy
        FROM ai_agent_version
        WHERE id = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "agent-version-uuid-001",
        version_row.get::<String, _>("uuid")
    );
    assert_eq!(1_i64, version_row.get::<i64, _>("agent_id"));
    assert_eq!(1_i64, version_row.get::<i64, _>("version_no"));
    assert_eq!(1_i64, version_row.get::<i64, _>("release_status"));
    assert_eq!(
        "You are a precise launch content agent.",
        version_row.get::<String, _>("system_prompt")
    );
    assert_eq!(
        "gpt-5.1",
        serde_json::from_str::<serde_json::Value>(&version_row.get::<String, _>("model_policy"))
            .unwrap()["model"]
    );
    assert_eq!(
        true,
        serde_json::from_str::<serde_json::Value>(&version_row.get::<String, _>("memory_policy"))
            .unwrap()["enabled"]
    );

    let items = store
        .list_agents(
            subject,
            AppAgentRegistryQuery {
                keyword: Some("studio".to_owned()),
                page_no: Some(1),
                page_size: Some(20),
            },
        )
        .await
        .unwrap();
    assert_eq!(1, items.len());
    assert_eq!("Product Studio Agent", items[0].name);

    let loaded = store
        .get_agent(subject, "1".to_owned())
        .await
        .unwrap()
        .expect("agent must be visible to the owner subject");
    assert_eq!("product-studio-agent", loaded.code);
    assert_eq!(1, loaded.capabilities.mcp_server_count);

    let loaded_by_code = store
        .get_agent(subject, "product-studio-agent".to_owned())
        .await
        .unwrap()
        .expect("agent code must be accepted as a stable detail identifier");
    assert_eq!(loaded.id, loaded_by_code.id);
    assert_eq!("Product Studio Agent", loaded_by_code.name);
}

#[tokio::test]
async fn sqlite_app_agent_registry_store_returns_existing_agent_for_idempotent_retry() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_tables(&pool).await;
    let store = SqliteAppAgentRegistryStore::new(pool.clone());
    let subject = AppAgentRegistrySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let first = store
        .create_agent(agent_command(
            subject,
            "create-product-studio-agent",
            "request-product-studio-agent-1",
            "agent-uuid-001",
            "agent-version-uuid-001",
        ))
        .await
        .unwrap();
    let retry = store
        .create_agent(agent_command(
            subject,
            "create-product-studio-agent",
            "request-product-studio-agent-2",
            "agent-uuid-retry",
            "agent-version-uuid-retry",
        ))
        .await
        .unwrap();

    assert_eq!(first.id, retry.id);
    assert_eq!("product-studio-agent", retry.code);
    let agent_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM ai_agent")
        .fetch_one(&pool)
        .await
        .unwrap();
    let version_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM ai_agent_version")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(1, agent_count);
    assert_eq!(1, version_count);

    let different_key_result = store
        .create_agent(agent_command(
            subject,
            "create-product-studio-agent-different-key",
            "request-product-studio-agent-3",
            "agent-uuid-002",
            "agent-version-uuid-002",
        ))
        .await;
    let error = different_key_result
        .expect_err("same agent code with a different idempotency key must remain a conflict");
    assert!(error.is_conflict());
    assert!(error.to_string().contains("agent code already exists"));
}

#[tokio::test]
async fn sqlite_app_agent_registry_store_rejects_same_idempotency_key_with_different_payload() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_tables(&pool).await;
    let store = SqliteAppAgentRegistryStore::new(pool.clone());
    let subject = AppAgentRegistrySubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let first = store
        .create_agent(agent_command(
            subject,
            "create-product-studio-agent",
            "request-product-studio-agent-1",
            "agent-uuid-001",
            "agent-version-uuid-001",
        ))
        .await
        .unwrap();

    let mut mismatched_command = agent_command(
        subject,
        "create-product-studio-agent",
        "request-product-studio-agent-2",
        "agent-uuid-002",
        "agent-version-uuid-002",
    );
    mismatched_command.agent_code = "market-research-agent".to_owned();
    mismatched_command.name = "Market Research Agent".to_owned();

    let error = store
        .create_agent(mismatched_command)
        .await
        .expect_err("idempotency retry with different payload must not return the existing agent");
    assert!(error.is_conflict());
    assert!(error
        .to_string()
        .contains("idempotency key already exists with different agent payload"));

    let agent_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM ai_agent")
        .fetch_one(&pool)
        .await
        .unwrap();
    let version_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM ai_agent_version")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(1, agent_count);
    assert_eq!(1, version_count);
    assert_eq!("product-studio-agent", first.code);
}

async fn create_agent_tables(pool: &sqlx::SqlitePool) {
    sqlx::query(
        r#"
        CREATE TABLE ai_agent (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            owner_user_id INTEGER NOT NULL,
            agent_code TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            visibility INTEGER NOT NULL,
            default_version_id INTEGER,
            avatar_url TEXT,
            template_source TEXT,
            governance_status INTEGER,
            published_at TEXT,
            published_by INTEGER
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        "CREATE UNIQUE INDEX uk_ai_agent_tenant_code ON ai_agent (tenant_id, organization_id, agent_code)",
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE ai_agent_version (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL DEFAULT 0,
            organization_id INTEGER NOT NULL DEFAULT 0,
            data_scope INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            agent_id INTEGER NOT NULL,
            version_no INTEGER NOT NULL,
            release_status INTEGER NOT NULL,
            system_prompt TEXT,
            model_policy TEXT,
            tool_policy TEXT,
            memory_policy TEXT,
            mcp_policy TEXT,
            skill_policy TEXT,
            runtime_policy TEXT,
            config_hash TEXT,
            published_at TEXT,
            published_by INTEGER
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

fn agent_command(
    subject: AppAgentRegistrySubject,
    idempotency_key: &str,
    request_id: &str,
    agent_uuid: &str,
    version_uuid: &str,
) -> CreateAppAgentCommand {
    CreateAppAgentCommand {
        subject,
        agent_uuid: agent_uuid.to_owned(),
        version_uuid: version_uuid.to_owned(),
        idempotency_key: idempotency_key.to_owned(),
        request_id: request_id.to_owned(),
        agent_code: "product-studio-agent".to_owned(),
        name: "Product Studio Agent".to_owned(),
        description: Some("Creates product launch assets".to_owned()),
        model: Some("gpt-5.1".to_owned()),
        system_prompt: Some("You are a precise launch content agent.".to_owned()),
        tool_policy: json!({ "enabled": true }),
        memory_policy: json!({ "enabled": true }),
        mcp_policy: json!({ "servers": ["filesystem"] }),
        skill_policy: json!({ "skills": ["image.generate"] }),
        runtime_policy: json!({ "executionMode": "interactive" }),
        requested_at: "2026-05-17 08:00:00".to_owned(),
    }
}
