use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppGenerationAgentRunStore;
use sdkwork_claw_product::ports::{
    AppGenerationAgentRunCommand, AppGenerationAgentRunStore, AppGenerationHistorySubject,
    AppGenerationReferenceImage,
};
use serde_json::Value;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;

#[tokio::test]
async fn sqlite_generation_agent_run_store_persists_agent_metadata_and_returns_standard_run_snapshot(
) {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_generation_job_table(&pool).await;
    create_agent_runtime_tables(&pool).await;
    let store = SqliteAppGenerationAgentRunStore::new(pool.clone());

    let outcome = store
        .create_agent_run(AppGenerationAgentRunCommand {
            subject: AppGenerationHistorySubject {
                tenant_id: 10,
                organization_id: 20,
                user_id: 30,
            },
            run_uuid: "run-uuid-001".to_owned(),
            request_id: "generation-agent-run-001".to_owned(),
            prompt: "Create a product launch image".to_owned(),
            target_type: "image".to_owned(),
            selected_model: Some("gpt-image-1".to_owned()),
            generation_config: serde_json::json!({
                "imageCount": 2,
                "aspectRatio": "16:9",
                "quality": "high"
            }),
            reference_images: vec![AppGenerationReferenceImage {
                name: "brand-reference.png".to_owned(),
                mime_type: Some("image/png".to_owned()),
                size_bytes: Some(2048),
                data_url: Some("data:image/png;base64,ZmFrZQ==".to_owned()),
                url: Some("https://cdn.example.test/brand-reference.png".to_owned()),
                asset_id: Some("asset-reference-1".to_owned()),
            }],
            requested_at: "2026-05-17 08:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("1", outcome.run.id);
    assert_eq!("generation-agent-run-001", outcome.run.request_id);
    assert_eq!("generation-agent", outcome.run.source);
    assert_eq!("queued", outcome.run.status);
    assert_eq!("default-generation-agent", outcome.agent.id);
    assert_eq!("default-generation-agent-v1", outcome.agent.version_id);
    assert_eq!("gpt-image-1", outcome.agent.model.as_deref().unwrap());
    assert_eq!("1-step-input", outcome.steps[0].id);
    assert_eq!("input", outcome.steps[0].step_type);
    assert_eq!("succeeded", outcome.steps[0].status);
    assert_eq!("token", outcome.usage.events[0].event_type);
    assert!(outcome.usage.prompt_tokens > 0);
    assert_eq!(outcome.usage.prompt_tokens, outcome.usage.total_tokens);
    assert_eq!(
        outcome.usage.prompt_tokens.to_string(),
        outcome.usage.events[0].quantity
    );
    assert_eq!(2, outcome.usage.image_count);
    assert_eq!("0", outcome.usage.video_seconds);
    assert_eq!(
        "agent-runtime",
        outcome.usage.events[0].usage_fact_metadata.metering_source
    );
    assert_eq!("30", outcome.usage.events[0].usage_fact_metadata.user_id);
    assert_eq!(
        "1-step-input",
        outcome.metering_events[0].usage_fact_metadata.step_id
    );

    let row = sqlx::query(
        r#"
        SELECT uuid, request_id, job_type, modality, model, prompt, metadata, parameter_snapshot
        FROM ai_generation_job
        WHERE id = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("run-uuid-001", row.get::<String, _>("uuid"));
    assert_eq!(
        "generation-agent-run-001",
        row.get::<String, _>("request_id")
    );
    assert_eq!(1_i64, row.get::<i64, _>("job_type"));
    assert_eq!(2_i64, row.get::<i64, _>("modality"));
    assert_eq!("gpt-image-1", row.get::<String, _>("model"));
    assert_eq!(
        "Create a product launch image",
        row.get::<String, _>("prompt")
    );

    let metadata: Value = serde_json::from_str(&row.get::<String, _>("metadata")).unwrap();
    assert_eq!("generation-agent", metadata["source"]);
    assert_eq!("default-generation-agent", metadata["agentId"]);
    assert_eq!("default-generation-agent-v1", metadata["agentVersionId"]);
    assert_eq!("run-step-event-metering", metadata["runLifecycle"]);
    assert_eq!("image", metadata["targetType"]);
    assert_eq!(2, metadata["generationConfig"]["imageCount"]);
    assert_eq!("16:9", metadata["generationConfig"]["aspectRatio"]);
    assert_eq!(
        "brand-reference.png",
        metadata["referenceImages"][0]["name"]
    );
    assert_eq!("image/png", metadata["referenceImages"][0]["mimeType"]);
    assert_eq!(
        "data:image/png;base64,ZmFrZQ==",
        metadata["referenceImages"][0]["dataUrl"]
    );
    assert_eq!(
        "https://cdn.example.test/brand-reference.png",
        metadata["referenceImages"][0]["url"]
    );
    assert_eq!(
        "asset-reference-1",
        metadata["referenceImages"][0]["assetId"]
    );

    let parameter_snapshot: Value =
        serde_json::from_str(&row.get::<String, _>("parameter_snapshot")).unwrap();
    assert_eq!(metadata, parameter_snapshot);

    let agent = sqlx::query(
        r#"
        SELECT id, uuid, owner_user_id, agent_code, name, visibility, status, default_version_id
        FROM ai_agent
        WHERE tenant_id = 10 AND organization_id = 20 AND agent_code = 'default-generation-agent'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1_i64, agent.get::<i64, _>("id"));
    assert_eq!("default-generation-agent", agent.get::<String, _>("uuid"));
    assert_eq!(30_i64, agent.get::<i64, _>("owner_user_id"));
    assert_eq!("default-generation-agent", agent.get::<String, _>("agent_code"));
    assert_eq!("Generation Agent", agent.get::<String, _>("name"));
    assert_eq!(1_i64, agent.get::<i64, _>("visibility"));
    assert_eq!(1_i64, agent.get::<i64, _>("status"));
    assert_eq!(1_i64, agent.get::<i64, _>("default_version_id"));

    let version = sqlx::query(
        r#"
        SELECT id, uuid, agent_id, version_no, release_status, status, model_policy
        FROM ai_agent_version
        WHERE tenant_id = 10 AND organization_id = 20 AND agent_id = 1 AND version_no = 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1_i64, version.get::<i64, _>("id"));
    assert_eq!(
        "default-generation-agent-v1",
        version.get::<String, _>("uuid")
    );
    assert_eq!(1_i64, version.get::<i64, _>("agent_id"));
    assert_eq!(1_i64, version.get::<i64, _>("version_no"));
    assert_eq!(1_i64, version.get::<i64, _>("release_status"));
    assert_eq!(1_i64, version.get::<i64, _>("status"));
    let model_policy: Value = serde_json::from_str(&version.get::<String, _>("model_policy")).unwrap();
    assert_eq!("gpt-image-1", model_policy["selectedModel"]);

    let usage_fact = sqlx::query(
        r#"
        SELECT id, uuid, user_id, request_id, owner_type, owner_id, catalog_key, model,
               modality, usage_type, billing_meter_code, billable_quantity, prompt_tokens,
               total_tokens, image_count, video_seconds, settlement_status, metadata
        FROM ai_usage_fact
        WHERE tenant_id = 10 AND organization_id = 20 AND request_id = 'generation-agent-run-001'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1_i64, usage_fact.get::<i64, _>("id"));
    assert_eq!(
        "usage-run-uuid-001",
        usage_fact.get::<String, _>("uuid")
    );
    assert_eq!(30_i64, usage_fact.get::<i64, _>("user_id"));
    assert_eq!(1_i64, usage_fact.get::<i64, _>("owner_type"));
    assert_eq!(30_i64, usage_fact.get::<i64, _>("owner_id"));
    assert_eq!("gpt-image-1", usage_fact.get::<String, _>("catalog_key"));
    assert_eq!("gpt-image-1", usage_fact.get::<String, _>("model"));
    assert_eq!(2_i64, usage_fact.get::<i64, _>("modality"));
    assert_eq!(1_i64, usage_fact.get::<i64, _>("usage_type"));
    assert_eq!(
        "llm_input_token",
        usage_fact.get::<String, _>("billing_meter_code")
    );
    assert_eq!(
        outcome.usage.prompt_tokens.to_string(),
        usage_fact.get::<String, _>("billable_quantity")
    );
    assert_eq!(outcome.usage.prompt_tokens, usage_fact.get::<i64, _>("prompt_tokens"));
    assert_eq!(outcome.usage.total_tokens, usage_fact.get::<i64, _>("total_tokens"));
    assert_eq!(2_i64, usage_fact.get::<i64, _>("image_count"));
    assert_eq!("0", usage_fact.get::<String, _>("video_seconds"));
    assert_eq!(0_i64, usage_fact.get::<i64, _>("settlement_status"));
    let usage_metadata: Value = serde_json::from_str(&usage_fact.get::<String, _>("metadata")).unwrap();
    assert_eq!("default-generation-agent", usage_metadata["agentId"]);
    assert_eq!("default-generation-agent-v1", usage_metadata["agentVersionId"]);
    assert_eq!("1", usage_metadata["runId"]);
    assert_eq!("1-step-input", usage_metadata["stepId"]);
    assert_eq!("30", usage_metadata["userId"]);
    assert_eq!("agent-runtime", usage_metadata["meteringSource"]);

    let agent_run = sqlx::query(
        r#"
        SELECT id, uuid, user_id, request_id, agent_id, agent_version_id, run_uuid, run_status,
               source_surface, input_message, target_modality, planner_model, execution_mode,
               usage_fact_id, total_steps, prompt_tokens, total_tokens, image_count, video_seconds
        FROM ai_agent_run
        WHERE tenant_id = 10 AND organization_id = 20 AND request_id = 'generation-agent-run-001'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1_i64, agent_run.get::<i64, _>("id"));
    assert_eq!("run-uuid-001", agent_run.get::<String, _>("uuid"));
    assert_eq!(30_i64, agent_run.get::<i64, _>("user_id"));
    assert_eq!(1_i64, agent_run.get::<i64, _>("agent_id"));
    assert_eq!(1_i64, agent_run.get::<i64, _>("agent_version_id"));
    assert_eq!("run-uuid-001", agent_run.get::<String, _>("run_uuid"));
    assert_eq!(1_i64, agent_run.get::<i64, _>("run_status"));
    assert_eq!("app", agent_run.get::<String, _>("source_surface"));
    assert_eq!(
        "Create a product launch image",
        agent_run.get::<String, _>("input_message")
    );
    assert_eq!(2_i64, agent_run.get::<i64, _>("target_modality"));
    assert_eq!("gpt-image-1", agent_run.get::<String, _>("planner_model"));
    assert_eq!("generation", agent_run.get::<String, _>("execution_mode"));
    assert_eq!(1_i64, agent_run.get::<i64, _>("usage_fact_id"));
    assert_eq!(1_i64, agent_run.get::<i64, _>("total_steps"));
    assert_eq!(outcome.usage.prompt_tokens, agent_run.get::<i64, _>("prompt_tokens"));
    assert_eq!(outcome.usage.total_tokens, agent_run.get::<i64, _>("total_tokens"));
    assert_eq!(2_i64, agent_run.get::<i64, _>("image_count"));
    assert_eq!("0", agent_run.get::<String, _>("video_seconds"));

    let step = sqlx::query(
        r#"
        SELECT uuid, user_id, request_id, run_id, agent_id, agent_version_id, step_index,
               step_type, step_status, title, model, input_snapshot, completed_at,
               prompt_tokens, total_tokens, image_count, video_seconds, usage_fact_id
        FROM ai_agent_run_step
        WHERE tenant_id = 10 AND organization_id = 20 AND run_id = 1 AND step_index = 0
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("run-uuid-001-step-input", step.get::<String, _>("uuid"));
    assert_eq!(30_i64, step.get::<i64, _>("user_id"));
    assert_eq!("generation-agent-run-001", step.get::<String, _>("request_id"));
    assert_eq!(1_i64, step.get::<i64, _>("run_id"));
    assert_eq!(1_i64, step.get::<i64, _>("agent_id"));
    assert_eq!(1_i64, step.get::<i64, _>("agent_version_id"));
    assert_eq!(0_i64, step.get::<i64, _>("step_index"));
    assert_eq!(1_i64, step.get::<i64, _>("step_type"));
    assert_eq!(3_i64, step.get::<i64, _>("step_status"));
    assert_eq!("User input accepted", step.get::<String, _>("title"));
    assert_eq!("gpt-image-1", step.get::<String, _>("model"));
    let input_snapshot: Value = serde_json::from_str(&step.get::<String, _>("input_snapshot")).unwrap();
    assert_eq!("Create a product launch image", input_snapshot["prompt"]);
    assert_eq!("image", input_snapshot["targetType"]);
    assert_eq!(1_i64, step.get::<i64, _>("usage_fact_id"));
}

async fn create_generation_job_table(pool: &sqlx::SqlitePool) {
    sqlx::query(
        r#"
        CREATE TABLE ai_generation_job (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            metadata TEXT NOT NULL,
            job_type INTEGER,
            modality INTEGER,
            model TEXT,
            prompt TEXT,
            parameter_snapshot TEXT,
            progress_percent INTEGER
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn create_agent_runtime_tables(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE ai_agent (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
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
        r#"CREATE UNIQUE INDEX uk_ai_agent_tenant_code ON ai_agent (tenant_id, organization_id, agent_code)"#,
        r#"
        CREATE TABLE ai_agent_version (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
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
        r#"CREATE UNIQUE INDEX uk_ai_agent_version_agent_no ON ai_agent_version (tenant_id, organization_id, agent_id, version_no)"#,
        r#"
        CREATE TABLE ai_usage_fact (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER,
            request_id TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT NOT NULL DEFAULT '{}',
            owner_type INTEGER,
            owner_id INTEGER,
            catalog_key TEXT NOT NULL,
            model TEXT,
            modality INTEGER,
            usage_type INTEGER,
            billing_meter_code TEXT,
            billable_quantity TEXT,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            cached_tokens INTEGER,
            total_tokens INTEGER,
            request_count INTEGER,
            image_count INTEGER,
            video_seconds TEXT,
            occurred_at TEXT,
            settlement_status INTEGER
        )
        "#,
        r#"CREATE UNIQUE INDEX uk_ai_usage_fact_request ON ai_usage_fact (tenant_id, organization_id, request_id, usage_type)"#,
        r#"
        CREATE TABLE ai_agent_run (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT NOT NULL DEFAULT '{}',
            agent_id INTEGER NOT NULL,
            agent_version_id INTEGER NOT NULL,
            run_uuid TEXT NOT NULL,
            run_status INTEGER NOT NULL,
            source_surface TEXT,
            input_message TEXT,
            output_message TEXT,
            target_modality INTEGER,
            planner_model TEXT,
            execution_mode TEXT,
            started_at TEXT,
            completed_at TEXT,
            metering_status INTEGER,
            usage_fact_id INTEGER,
            total_steps INTEGER,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            cached_tokens INTEGER,
            total_tokens INTEGER,
            image_count INTEGER,
            audio_seconds TEXT,
            video_seconds TEXT
        )
        "#,
        r#"CREATE UNIQUE INDEX uk_ai_agent_run_request ON ai_agent_run (tenant_id, organization_id, request_id)"#,
        r#"
        CREATE TABLE ai_agent_run_step (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER,
            request_id TEXT,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT NOT NULL DEFAULT '{}',
            run_id INTEGER NOT NULL,
            agent_id INTEGER,
            agent_version_id INTEGER,
            step_index INTEGER NOT NULL,
            step_type INTEGER NOT NULL,
            step_status INTEGER NOT NULL,
            title TEXT,
            model TEXT,
            input_snapshot TEXT,
            output_snapshot TEXT,
            started_at TEXT,
            completed_at TEXT,
            latency_ms INTEGER,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            cached_tokens INTEGER,
            total_tokens INTEGER,
            image_count INTEGER,
            audio_seconds TEXT,
            video_seconds TEXT,
            usage_fact_id INTEGER
        )
        "#,
        r#"CREATE UNIQUE INDEX uk_ai_agent_run_step_index ON ai_agent_run_step (tenant_id, organization_id, run_id, step_index)"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
