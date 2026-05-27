use sdkwork_claw_product::infrastructure::sql::installer::DatabaseInstaller;
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqliteAdminMcpStore, SqliteAdminPromptStore,
};
use sdkwork_claw_product::ports::{
    AdminMcpStore, AdminMcpSubject, AdminPromptStore, AdminPromptSubject,
    CreateAdminMcpBindingCommand, CreateAdminMcpServerCommand, CreateAdminMcpServerRevisionCommand,
    CreateAdminPromptBindingCommand, CreateAdminPromptCommand, CreateAdminPromptVersionCommand,
    DiscoverAdminMcpToolsCommand, ListAdminMcpBindingsQuery, ListAdminMcpServerRevisionsQuery,
    ListAdminMcpServersQuery, ListAdminMcpToolsQuery, ListAdminPromptBindingsQuery,
    ListAdminPromptVersionsQuery, ListAdminPromptsQuery, PublishAdminMcpServerRevisionCommand,
    PublishAdminPromptVersionCommand, RenderAdminPromptVersionCommand,
    TestAdminMcpServerHealthCommand, UpdateAdminMcpBindingCommand, UpdateAdminMcpToolCommand,
    UpdateAdminPromptBindingCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_admin_prompt_and_mcp_stores_manage_vertical_assets() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    DatabaseInstaller::for_sqlite(pool.clone())
        .ensure_installed()
        .await
        .unwrap();

    let prompt_store = SqliteAdminPromptStore::new(pool.clone());
    let prompt = prompt_store
        .create_prompt(CreateAdminPromptCommand {
            subject: prompt_subject(),
            prompt_key: "system.general.assistant".to_owned(),
            name: "General Assistant".to_owned(),
            description: Some("Default assistant prompt".to_owned()),
            category_id: None,
            prompt_type: "system".to_owned(),
            visibility: "organization".to_owned(),
            tags: vec!["assistant".to_owned(), "general".to_owned()],
        })
        .await
        .unwrap();
    assert_eq!("system.general.assistant", prompt.prompt_key);
    assert_eq!("enabled", prompt.status);

    let version = prompt_store
        .create_version(CreateAdminPromptVersionCommand {
            subject: prompt_subject(),
            prompt_id: prompt.id,
            version_no: "1.0.0".to_owned(),
            title: "Initial release".to_owned(),
            content: "You are a {{tone}} assistant.".to_owned(),
            variable_schema: json!({ "tone": { "type": "string" } }),
            output_schema: json!({ "type": "object" }),
            model_constraints: json!({}),
            safety_policy: json!({}),
            examples_json: json!([]),
        })
        .await
        .unwrap();
    assert_eq!("draft", version.lifecycle_status);

    let published = prompt_store
        .publish_version(PublishAdminPromptVersionCommand {
            subject: prompt_subject(),
            version_id: version.id,
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("published", published.lifecycle_status);

    let rendered = prompt_store
        .render_version(RenderAdminPromptVersionCommand {
            subject: prompt_subject(),
            version_id: version.id,
            variables: json!({ "tone": "professional" }),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("You are a professional assistant.", rendered);

    let prompt_binding = prompt_store
        .create_binding(CreateAdminPromptBindingCommand {
            subject: prompt_subject(),
            prompt_id: prompt.id,
            prompt_version_id: Some(version.id),
            owner_type: "agent".to_owned(),
            owner_id: 100,
            binding_role: "system".to_owned(),
            priority: 10,
            enabled: true,
            policy_json: json!({ "maxCalls": 4 }),
        })
        .await
        .unwrap();
    assert_eq!("agent", prompt_binding.owner_type);
    assert_eq!(version.id, prompt_binding.prompt_version_id.unwrap());

    let updated_prompt_binding = prompt_store
        .update_binding(UpdateAdminPromptBindingCommand {
            subject: prompt_subject(),
            binding_id: prompt_binding.id,
            prompt_version_id: Some(None),
            owner_type: None,
            owner_id: None,
            binding_role: Some("fallback".to_owned()),
            priority: Some(20),
            enabled: Some(false),
            policy_json: Some(json!({ "maxCalls": 8 })),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("fallback", updated_prompt_binding.binding_role);
    assert_eq!(None, updated_prompt_binding.prompt_version_id);
    assert!(!updated_prompt_binding.enabled);
    let prompts = prompt_store
        .list_prompts(ListAdminPromptsQuery {
            subject: prompt_subject(),
            keyword: Some("assistant".to_owned()),
            prompt_type: Some("system".to_owned()),
            visibility: None,
            status: Some("enabled".to_owned()),
            category_id: None,
            page_no: 1,
            page_size: 50,
            offset: 0,
        })
        .await
        .unwrap();
    assert_eq!(1, prompts.len());
    let versions = prompt_store
        .list_versions(ListAdminPromptVersionsQuery {
            subject: prompt_subject(),
            prompt_id: prompt.id,
        })
        .await
        .unwrap();
    assert_eq!(1, versions.len());
    let prompt_bindings = prompt_store
        .list_bindings(ListAdminPromptBindingsQuery {
            subject: prompt_subject(),
            prompt_id: prompt.id,
        })
        .await
        .unwrap();
    assert_eq!("agent", prompt_bindings[0].owner_type);

    let mcp_store = SqliteAdminMcpStore::new(pool.clone());
    let server = mcp_store
        .create_server(CreateAdminMcpServerCommand {
            subject: mcp_subject(),
            server_key: "workspace.context".to_owned(),
            name: "Workspace Context".to_owned(),
            description: Some("Workspace knowledge server".to_owned()),
            category_id: None,
            transport: "http".to_owned(),
            visibility: "organization".to_owned(),
            tags: vec!["context".to_owned()],
        })
        .await
        .unwrap();
    assert_eq!("workspace.context", server.server_key);

    let revision = mcp_store
        .create_revision(CreateAdminMcpServerRevisionCommand {
            subject: mcp_subject(),
            server_id: server.id,
            revision_no: "1.0.0".to_owned(),
            transport: "http".to_owned(),
            endpoint_url: Some("https://mcp.example.com/context".to_owned()),
            command: None,
            args_json: json!([]),
            env_schema: json!({}),
            auth_type: "secret_ref".to_owned(),
            secret_ref: Some("secret://mcp/workspace-context".to_owned()),
            timeout_ms: 30000,
            retry_policy: json!({ "maxAttempts": 2 }),
        })
        .await
        .unwrap();
    let published_revision = mcp_store
        .publish_revision(PublishAdminMcpServerRevisionCommand {
            subject: mcp_subject(),
            revision_id: revision.id,
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("published", published_revision.lifecycle_status);

    let tool_id = insert_mcp_tool(&pool, server.id, revision.id).await;
    let discovery = mcp_store
        .discover_tools(DiscoverAdminMcpToolsCommand {
            subject: mcp_subject(),
            server_id: server.id,
        })
        .await
        .unwrap();
    assert_eq!(1, discovery.discovered_count);
    assert_eq!("searchWorkspace", discovery.tools[0].tool_key);

    let health = mcp_store
        .check_health(TestAdminMcpServerHealthCommand {
            subject: mcp_subject(),
            server_id: server.id,
        })
        .await
        .unwrap();
    assert!(health.healthy);

    let tools = mcp_store
        .list_tools(ListAdminMcpToolsQuery {
            subject: mcp_subject(),
            server_id: server.id,
        })
        .await
        .unwrap();
    assert_eq!(1, tools.len());
    let updated_tool = mcp_store
        .update_tool(UpdateAdminMcpToolCommand {
            subject: mcp_subject(),
            tool_id: tools[0].id,
            name: None,
            description: None,
            input_schema: None,
            output_schema: None,
            risk_level: Some("medium".to_owned()),
            requires_approval: Some(true),
            enabled: Some(true),
            status: None,
            rate_limit_policy: None,
            sort_weight: Some(20),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("medium", updated_tool.risk_level);
    assert!(updated_tool.requires_approval);

    let mcp_binding = mcp_store
        .create_binding(CreateAdminMcpBindingCommand {
            subject: mcp_subject(),
            server_id: server.id,
            server_revision_id: Some(revision.id),
            tool_id: Some(tool_id),
            owner_type: "agent".to_owned(),
            owner_id: 100,
            allowed_tools: json!(["searchWorkspace"]),
            denied_tools: json!([]),
            policy_json: json!({ "maxCalls": 4 }),
            priority: 10,
            enabled: true,
            status: "enabled".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(tool_id, mcp_binding.tool_id.unwrap());

    let updated_mcp_binding = mcp_store
        .update_binding(UpdateAdminMcpBindingCommand {
            subject: mcp_subject(),
            binding_id: mcp_binding.id,
            server_revision_id: None,
            tool_id: None,
            owner_type: None,
            owner_id: None,
            allowed_tools: None,
            denied_tools: Some(json!(["deleteWorkspace"])),
            policy_json: None,
            priority: Some(20),
            enabled: Some(false),
            status: Some("disabled".to_owned()),
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!(20, updated_mcp_binding.priority);
    assert_eq!("disabled", updated_mcp_binding.status);
    assert!(!updated_mcp_binding.enabled);

    let servers = mcp_store
        .list_servers(ListAdminMcpServersQuery {
            subject: mcp_subject(),
            keyword: Some("workspace".to_owned()),
            transport: Some("http".to_owned()),
            visibility: None,
            status: Some("enabled".to_owned()),
            category_id: None,
            page_no: 1,
            page_size: 50,
            offset: 0,
        })
        .await
        .unwrap();
    assert_eq!(1, servers.len());
    let revisions = mcp_store
        .list_revisions(ListAdminMcpServerRevisionsQuery {
            subject: mcp_subject(),
            server_id: server.id,
        })
        .await
        .unwrap();
    assert_eq!(1, revisions.len());
    let bindings = mcp_store
        .list_bindings(ListAdminMcpBindingsQuery {
            subject: mcp_subject(),
            server_id: server.id,
        })
        .await
        .unwrap();
    assert_eq!("agent", bindings[0].owner_type);
}

async fn insert_mcp_tool(pool: &sqlx::SqlitePool, server_id: i64, revision_id: i64) -> i64 {
    let result = sqlx::query(
        r#"
        INSERT INTO ai_mcp_tool
            (uuid, tenant_id, organization_id, server_id, server_revision_id, tool_key, name,
             description, input_schema, output_schema, risk_level, requires_approval, enabled,
             rate_limit_policy, schema_hash, discovered_at, sort_weight)
        VALUES
            ('mcp-tool-test', 10, 20, ?1, ?2, 'searchWorkspace', 'Search Workspace',
             'Search workspace knowledge', '{"type":"object"}', '{"type":"object"}',
             'low', 0, 1, '{}', 'hash', CURRENT_TIMESTAMP, 10)
        "#,
    )
    .bind(server_id)
    .bind(revision_id)
    .execute(pool)
    .await
    .unwrap();
    result.last_insert_rowid()
}

fn prompt_subject() -> AdminPromptSubject {
    AdminPromptSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 30,
        operator_type: 1,
    }
}

fn mcp_subject() -> AdminMcpSubject {
    AdminMcpSubject {
        tenant_id: 10,
        organization_id: 20,
        operator_id: 30,
        operator_type: 1,
    }
}
