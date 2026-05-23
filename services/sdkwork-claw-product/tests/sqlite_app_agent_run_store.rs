use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppAgentRunStore;
use sdkwork_claw_product::ports::{
    AppAgentRunStore, AppAgentRunSubject, CompleteAppAgentRunCommand,
    CompleteAppAgentRunStepCommand, CreateAppAgentRunCommand, CreateAppAgentRunStepCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;

#[tokio::test]
async fn sqlite_app_agent_run_store_manages_runs_steps_and_session_counters() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_run_tables(&pool).await;
    seed_agent_session(&pool).await;
    seed_runtime_invocations(&pool).await;
    let store = SqliteAppAgentRunStore::new(pool.clone());
    let subject = AppAgentRunSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let run = store
        .create_run(CreateAppAgentRunCommand {
            subject,
            session_id: "agent-session-1".to_owned(),
            run_uuid: "agent-run-uuid-1".to_owned(),
            agent_id: "101".to_owned(),
            agent_version_id: "201".to_owned(),
            request_id: "req-agent-run-1".to_owned(),
            trace_id: Some("trace-agent-run-1".to_owned()),
            source_surface: "chat".to_owned(),
            input_message: Some("Refine chat schema".to_owned()),
            memory_space_id: Some("memory-space-1".to_owned()),
            runtime: Some("codex".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            execution_mode: "interactive".to_owned(),
            metadata: json!({"client":"test"}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("agent-run-uuid-1", run.id);
    assert_eq!("agent-session-1", run.session_id.as_deref().unwrap());
    assert_eq!("101", run.agent_id);
    assert_eq!("201", run.agent_version_id);
    assert_eq!("running", run.status);
    assert_eq!("memory-space-1", run.memory_space_id.as_deref().unwrap());
    assert_eq!("codex", run.runtime.as_deref().unwrap());

    let step = store
        .create_step(CreateAppAgentRunStepCommand {
            subject,
            run_id: "agent-run-uuid-1".to_owned(),
            step_uuid: "agent-step-uuid-1".to_owned(),
            usage_link_uuid: "agent-step-usage-link-uuid-1".to_owned(),
            step_type: "model".to_owned(),
            status: "running".to_owned(),
            title: Some("Plan schema changes".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            runtime_invocation_id: Some("runtime-invocation-1".to_owned()),
            tool_name: Some("codex".to_owned()),
            input_json: json!({"prompt":"plan"}),
            output_json: json!({"delta":"ok"}),
            input_tokens: Some(11),
            output_tokens: Some(7),
            cached_tokens: Some(2),
            reasoning_tokens: None,
            total_tokens: Some(20),
            cost_amount: None,
            currency: None,
            usage_fact_id: None,
            usage_json: json!({"inputTokens":11,"outputTokens":7,"cachedTokens":2}),
            metadata: json!({"phase":"planning"}),
            requested_at: "2026-05-18 09:00:05".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("agent-step-uuid-1", step.id);
    assert_eq!("agent-run-uuid-1", step.run_id);
    assert_eq!(1, step.step_index);
    assert_eq!("model", step.step_type);
    assert_eq!(
        "runtime-invocation-1",
        step.runtime_invocation_id.as_deref().unwrap()
    );
    assert_eq!(20, step.total_tokens.unwrap());

    let completed_step = store
        .complete_step(CompleteAppAgentRunStepCommand {
            subject,
            run_id: "agent-run-uuid-1".to_owned(),
            step_id: "agent-step-uuid-1".to_owned(),
            usage_link_uuid: "agent-step-usage-link-uuid-complete".to_owned(),
            status: "completed".to_owned(),
            output_json: json!({"outputText":"Schema completed"}),
            error_message_masked: None,
            input_tokens: Some(13),
            output_tokens: Some(17),
            cached_tokens: Some(3),
            reasoning_tokens: Some(5),
            total_tokens: Some(38),
            cost_amount: Some("0.024".to_owned()),
            currency: Some("USD".to_owned()),
            usage_fact_id: Some(9101),
            usage_json: json!({"inputTokens":13,"outputTokens":17,"cachedTokens":3,"reasoningTokens":5}),
            metadata: json!({"completed":true}),
            requested_at: "2026-05-18 09:00:30".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!("completed", completed_step.status);
    assert_eq!(
        "2026-05-18 09:00:30",
        completed_step.completed_at.as_deref().unwrap()
    );
    assert_eq!(13, completed_step.input_tokens.unwrap());
    assert_eq!(17, completed_step.output_tokens.unwrap());
    assert_eq!(3, completed_step.cached_tokens.unwrap());
    assert_eq!(38, completed_step.total_tokens.unwrap());

    let completed_step_usage_link = sqlx::query(
        r#"
        SELECT
            uuid,
            usage_fact_id,
            input_tokens,
            output_tokens,
            cached_tokens,
            reasoning_tokens,
            total_tokens,
            cost_amount,
            currency
        FROM ai_runtime_usage_link
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND agent_run_id = 'agent-run-uuid-1'
          AND agent_run_step_id = 'agent-step-uuid-1'
          AND usage_type = 'agent_step'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "agent-step-usage-link-uuid-1",
        completed_step_usage_link.get::<String, _>("uuid")
    );
    assert_eq!(
        9101,
        completed_step_usage_link
            .get::<Option<i64>, _>("usage_fact_id")
            .unwrap()
    );
    assert_eq!(13, completed_step_usage_link.get::<i64, _>("input_tokens"));
    assert_eq!(17, completed_step_usage_link.get::<i64, _>("output_tokens"));
    assert_eq!(3, completed_step_usage_link.get::<i64, _>("cached_tokens"));
    assert_eq!(
        5,
        completed_step_usage_link.get::<i64, _>("reasoning_tokens")
    );
    assert_eq!(38, completed_step_usage_link.get::<i64, _>("total_tokens"));
    assert_eq!(
        "0.024",
        completed_step_usage_link
            .get::<Option<String>, _>("cost_amount")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "USD",
        completed_step_usage_link
            .get::<Option<String>, _>("currency")
            .as_deref()
            .unwrap()
    );

    let step_usage_link = sqlx::query(
        r#"
        SELECT
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            runtime_invocation_id,
            usage_type,
            model,
            request_id,
            trace_id,
            input_tokens,
            output_tokens,
            cached_tokens,
            total_tokens
        FROM ai_runtime_usage_link
        WHERE uuid = 'agent-step-usage-link-uuid-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(30, step_usage_link.get::<i64, _>("user_id"));
    assert_eq!(
        "agent-session-1",
        step_usage_link
            .get::<Option<String>, _>("agent_session_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "agent-run-uuid-1",
        step_usage_link
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "agent-step-uuid-1",
        step_usage_link
            .get::<Option<String>, _>("agent_run_step_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "runtime-invocation-1",
        step_usage_link
            .get::<Option<String>, _>("runtime_invocation_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!("agent_step", step_usage_link.get::<String, _>("usage_type"));
    assert_eq!(
        "gpt-5.1-codex",
        step_usage_link
            .get::<Option<String>, _>("model")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "req-agent-run-1",
        step_usage_link
            .get::<Option<String>, _>("request_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "trace-agent-run-1",
        step_usage_link
            .get::<Option<String>, _>("trace_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(13, step_usage_link.get::<i64, _>("input_tokens"));
    assert_eq!(17, step_usage_link.get::<i64, _>("output_tokens"));
    assert_eq!(3, step_usage_link.get::<i64, _>("cached_tokens"));
    assert_eq!(38, step_usage_link.get::<i64, _>("total_tokens"));

    let invocation = sqlx::query(
        r#"
        SELECT agent_run_id, agent_run_step_id
        FROM ai_runtime_invocation
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND uuid = 'runtime-invocation-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "agent-run-uuid-1",
        invocation
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "agent-step-uuid-1",
        invocation
            .get::<Option<String>, _>("agent_run_step_id")
            .as_deref()
            .unwrap()
    );

    let event = sqlx::query(
        r#"
        SELECT agent_run_id, agent_run_step_id
        FROM ai_runtime_invocation_event
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND uuid = 'runtime-event-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "agent-run-uuid-1",
        event
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "agent-step-uuid-1",
        event
            .get::<Option<String>, _>("agent_run_step_id")
            .as_deref()
            .unwrap()
    );

    let artifact = sqlx::query(
        r#"
        SELECT agent_run_id, agent_run_step_id
        FROM ai_runtime_artifact
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 30
          AND uuid = 'runtime-artifact-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "agent-run-uuid-1",
        artifact
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "agent-step-uuid-1",
        artifact
            .get::<Option<String>, _>("agent_run_step_id")
            .as_deref()
            .unwrap()
    );

    let isolated_invocation = sqlx::query(
        r#"
        SELECT agent_run_id, agent_run_step_id
        FROM ai_runtime_invocation
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 31
          AND uuid = 'runtime-invocation-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "other-run",
        isolated_invocation
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "other-step",
        isolated_invocation
            .get::<Option<String>, _>("agent_run_step_id")
            .as_deref()
            .unwrap()
    );

    let isolated_event = sqlx::query(
        r#"
        SELECT agent_run_id, agent_run_step_id
        FROM ai_runtime_invocation_event
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 31
          AND uuid = 'runtime-event-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "other-run",
        isolated_event
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "other-step",
        isolated_event
            .get::<Option<String>, _>("agent_run_step_id")
            .as_deref()
            .unwrap()
    );

    let isolated_artifact = sqlx::query(
        r#"
        SELECT agent_run_id, agent_run_step_id
        FROM ai_runtime_artifact
        WHERE tenant_id = 10
          AND organization_id = 20
          AND user_id = 31
          AND uuid = 'runtime-artifact-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "other-run",
        isolated_artifact
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "other-step",
        isolated_artifact
            .get::<Option<String>, _>("agent_run_step_id")
            .as_deref()
            .unwrap()
    );

    let completed = store
        .complete_run(CompleteAppAgentRunCommand {
            subject,
            run_id: "agent-run-uuid-1".to_owned(),
            usage_link_uuid: "agent-run-usage-link-uuid-1".to_owned(),
            status: "completed".to_owned(),
            output_message: Some("Schema completed".to_owned()),
            error_message_masked: None,
            input_tokens: Some(11),
            output_tokens: Some(7),
            cached_tokens: Some(2),
            reasoning_tokens: Some(3),
            total_tokens: Some(20),
            cost_amount: Some("0.012".to_owned()),
            currency: Some("USD".to_owned()),
            usage_fact_id: Some(9001),
            usage_json: json!({"inputTokens":11,"outputTokens":7,"cachedTokens":2}),
            metadata: json!({"completed":true}),
            requested_at: "2026-05-18 09:00:30".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("completed", completed.status);
    assert_eq!(
        "Schema completed",
        completed.output_message.as_deref().unwrap()
    );
    assert_eq!(
        "2026-05-18 09:00:30",
        completed.completed_at.as_deref().unwrap()
    );
    assert_eq!(1, completed.total_steps);
    assert_eq!(20, completed.total_tokens.unwrap());

    let run_usage_link = sqlx::query(
        r#"
        SELECT
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            runtime_invocation_id,
            usage_fact_id,
            usage_type,
            model,
            request_id,
            trace_id,
            input_tokens,
            output_tokens,
            cached_tokens,
            reasoning_tokens,
            total_tokens,
            cost_amount,
            currency
        FROM ai_runtime_usage_link
        WHERE uuid = 'agent-run-usage-link-uuid-1'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(30, run_usage_link.get::<i64, _>("user_id"));
    assert_eq!(
        "agent-session-1",
        run_usage_link
            .get::<Option<String>, _>("agent_session_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "agent-run-uuid-1",
        run_usage_link
            .get::<Option<String>, _>("agent_run_id")
            .as_deref()
            .unwrap()
    );
    assert!(run_usage_link
        .get::<Option<String>, _>("agent_run_step_id")
        .is_none());
    assert!(run_usage_link
        .get::<Option<String>, _>("runtime_invocation_id")
        .is_none());
    assert_eq!(
        9001,
        run_usage_link
            .get::<Option<i64>, _>("usage_fact_id")
            .unwrap()
    );
    assert_eq!(
        "agent_run_total",
        run_usage_link.get::<String, _>("usage_type")
    );
    assert_eq!(
        "gpt-5.1-codex",
        run_usage_link
            .get::<Option<String>, _>("model")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "req-agent-run-1",
        run_usage_link
            .get::<Option<String>, _>("request_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "trace-agent-run-1",
        run_usage_link
            .get::<Option<String>, _>("trace_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(11, run_usage_link.get::<i64, _>("input_tokens"));
    assert_eq!(7, run_usage_link.get::<i64, _>("output_tokens"));
    assert_eq!(2, run_usage_link.get::<i64, _>("cached_tokens"));
    assert_eq!(3, run_usage_link.get::<i64, _>("reasoning_tokens"));
    assert_eq!(20, run_usage_link.get::<i64, _>("total_tokens"));
    assert_eq!(
        "0.012",
        run_usage_link
            .get::<Option<String>, _>("cost_amount")
            .as_deref()
            .unwrap()
    );
    assert_eq!(
        "USD",
        run_usage_link
            .get::<Option<String>, _>("currency")
            .as_deref()
            .unwrap()
    );

    store
        .complete_run(CompleteAppAgentRunCommand {
            subject,
            run_id: "agent-run-uuid-1".to_owned(),
            usage_link_uuid: "agent-run-usage-link-uuid-2".to_owned(),
            status: "completed".to_owned(),
            output_message: Some("Schema completed".to_owned()),
            error_message_masked: None,
            input_tokens: Some(11),
            output_tokens: Some(7),
            cached_tokens: Some(2),
            reasoning_tokens: Some(3),
            total_tokens: Some(20),
            cost_amount: Some("0.012".to_owned()),
            currency: Some("USD".to_owned()),
            usage_fact_id: Some(9001),
            usage_json: json!({"inputTokens":11,"outputTokens":7,"cachedTokens":2}),
            metadata: json!({"completed":true}),
            requested_at: "2026-05-18 09:00:30".to_owned(),
        })
        .await
        .unwrap();

    let run_usage_link_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM ai_runtime_usage_link
        WHERE agent_run_id = 'agent-run-uuid-1'
          AND agent_run_step_id IS NULL
          AND usage_type = 'agent_run_total'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, run_usage_link_count);

    let listed_runs = store
        .list_runs(subject, "agent-session-1".to_owned(), 1, 20)
        .await
        .unwrap();
    assert_eq!(1, listed_runs.items.len());
    assert_eq!("agent-run-uuid-1", listed_runs.items[0].id);

    let loaded_run = store
        .get_run(subject, "agent-run-uuid-1".to_owned())
        .await
        .unwrap()
        .unwrap();
    assert_eq!("completed", loaded_run.status);

    let listed_steps = store
        .list_steps(subject, "agent-run-uuid-1".to_owned(), 1, 20)
        .await
        .unwrap();
    assert_eq!(1, listed_steps.items.len());
    assert_eq!("agent-step-uuid-1", listed_steps.items[0].id);

    let session = sqlx::query(
        "SELECT run_count, step_count, last_run_id, last_step_id, last_active_at, tool_call_count FROM ai_agent_session WHERE session_code = 'agent-session-1'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, session.get::<i64, _>("run_count"));
    assert_eq!(1, session.get::<i64, _>("step_count"));
    assert_eq!(
        "agent-run-uuid-1",
        session
            .get::<Option<String>, _>("last_run_id")
            .as_deref()
            .unwrap()
    );
    assert_eq!(1, session.get::<Option<i64>, _>("last_step_id").unwrap());
    assert_eq!(
        "2026-05-18 09:00:05",
        session
            .get::<Option<String>, _>("last_active_at")
            .as_deref()
            .unwrap()
    );
    assert_eq!(0, session.get::<i64, _>("tool_call_count"));

    let isolated = store
        .get_run(
            AppAgentRunSubject {
                tenant_id: 10,
                organization_id: 20,
                user_id: 31,
            },
            "agent-run-uuid-1".to_owned(),
        )
        .await
        .unwrap();
    assert!(isolated.is_none());
}

#[tokio::test]
async fn sqlite_app_agent_run_store_rejects_memory_and_runtime_mismatches_with_session() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_run_tables(&pool).await;
    seed_agent_session(&pool).await;
    let store = SqliteAppAgentRunStore::new(pool);
    let subject = AppAgentRunSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let memory_error = store
        .create_run(CreateAppAgentRunCommand {
            subject,
            session_id: "agent-session-1".to_owned(),
            run_uuid: "agent-run-uuid-memory-mismatch".to_owned(),
            agent_id: "101".to_owned(),
            agent_version_id: "201".to_owned(),
            request_id: "request-memory-mismatch".to_owned(),
            trace_id: None,
            source_surface: "chat".to_owned(),
            input_message: Some("Mismatch memory".to_owned()),
            memory_space_id: Some("another-memory-space".to_owned()),
            runtime: Some("codex".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            execution_mode: "interactive".to_owned(),
            metadata: json!({}),
            requested_at: "2026-05-18 08:01:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(memory_error.is_conflict());

    let runtime_error = store
        .create_run(CreateAppAgentRunCommand {
            subject,
            session_id: "agent-session-1".to_owned(),
            run_uuid: "agent-run-uuid-runtime-mismatch".to_owned(),
            agent_id: "101".to_owned(),
            agent_version_id: "201".to_owned(),
            request_id: "request-runtime-mismatch".to_owned(),
            trace_id: None,
            source_surface: "chat".to_owned(),
            input_message: Some("Mismatch runtime".to_owned()),
            memory_space_id: Some("memory-space-1".to_owned()),
            runtime: Some("gemini".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            execution_mode: "interactive".to_owned(),
            metadata: json!({}),
            requested_at: "2026-05-18 08:01:00".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(runtime_error.is_conflict());
}

#[tokio::test]
async fn sqlite_app_agent_run_store_hides_deleted_lifecycle_runs_and_steps() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_run_tables(&pool).await;
    seed_agent_session(&pool).await;
    let store = SqliteAppAgentRunStore::new(pool.clone());
    let subject = AppAgentRunSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    let run = store
        .create_run(CreateAppAgentRunCommand {
            subject,
            session_id: "agent-session-1".to_owned(),
            run_uuid: "agent-run-uuid-deleted".to_owned(),
            agent_id: "101".to_owned(),
            agent_version_id: "201".to_owned(),
            request_id: "req-agent-run-deleted".to_owned(),
            trace_id: None,
            source_surface: "chat".to_owned(),
            input_message: Some("Deleted lifecycle".to_owned()),
            memory_space_id: Some("memory-space-1".to_owned()),
            runtime: Some("codex".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            execution_mode: "interactive".to_owned(),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!("agent-run-uuid-deleted", run.id);

    let step = store
        .create_step(CreateAppAgentRunStepCommand {
            subject,
            run_id: "agent-run-uuid-deleted".to_owned(),
            step_uuid: "agent-step-uuid-deleted".to_owned(),
            usage_link_uuid: "agent-step-usage-link-uuid-deleted".to_owned(),
            step_type: "model".to_owned(),
            status: "completed".to_owned(),
            title: Some("Deleted step".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            runtime_invocation_id: None,
            tool_name: None,
            input_json: json!({}),
            output_json: json!({}),
            input_tokens: None,
            output_tokens: None,
            cached_tokens: None,
            reasoning_tokens: None,
            total_tokens: None,
            cost_amount: None,
            currency: None,
            usage_fact_id: None,
            usage_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:05".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!("agent-step-uuid-deleted", step.id);

    sqlx::query(
        r#"
        UPDATE ai_agent_run_step
        SET status = 'deleted'
        WHERE uuid = 'agent-step-uuid-deleted'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let visible_steps = store
        .list_steps(subject, "agent-run-uuid-deleted".to_owned(), 1, 20)
        .await
        .unwrap();
    assert!(visible_steps.items.is_empty());

    let replacement_step = store
        .create_step(CreateAppAgentRunStepCommand {
            subject,
            run_id: "agent-run-uuid-deleted".to_owned(),
            step_uuid: "agent-step-uuid-after-step-delete".to_owned(),
            usage_link_uuid: "agent-step-usage-link-uuid-after-step-delete".to_owned(),
            step_type: "model".to_owned(),
            status: "running".to_owned(),
            title: Some("Append after deleted step".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            runtime_invocation_id: None,
            tool_name: None,
            input_json: json!({}),
            output_json: json!({}),
            input_tokens: None,
            output_tokens: None,
            cached_tokens: None,
            reasoning_tokens: None,
            total_tokens: None,
            cost_amount: None,
            currency: None,
            usage_fact_id: None,
            usage_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:08".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(2, replacement_step.step_index);

    sqlx::query(
        r#"
        UPDATE ai_agent_run
        SET status = 'deleted'
        WHERE run_uuid = 'agent-run-uuid-deleted'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let listed_runs = store
        .list_runs(subject, "agent-session-1".to_owned(), 1, 20)
        .await
        .unwrap();
    assert!(listed_runs.items.is_empty());

    let loaded_run = store
        .get_run(subject, "agent-run-uuid-deleted".to_owned())
        .await
        .unwrap();
    assert!(loaded_run.is_none());

    let create_step_error = store
        .create_step(CreateAppAgentRunStepCommand {
            subject,
            run_id: "agent-run-uuid-deleted".to_owned(),
            step_uuid: "agent-step-uuid-after-run-delete".to_owned(),
            usage_link_uuid: "agent-step-usage-link-uuid-after-run-delete".to_owned(),
            step_type: "model".to_owned(),
            status: "running".to_owned(),
            title: Some("Should not append".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            runtime_invocation_id: None,
            tool_name: None,
            input_json: json!({}),
            output_json: json!({}),
            input_tokens: None,
            output_tokens: None,
            cached_tokens: None,
            reasoning_tokens: None,
            total_tokens: None,
            cost_amount: None,
            currency: None,
            usage_fact_id: None,
            usage_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:10".to_owned(),
        })
        .await
        .unwrap_err();
    assert!(create_step_error.is_not_found());
}

#[tokio::test]
async fn sqlite_app_agent_run_store_filters_steps_by_trusted_user_id() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_agent_run_tables(&pool).await;
    seed_agent_session(&pool).await;
    let store = SqliteAppAgentRunStore::new(pool.clone());
    let subject = AppAgentRunSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    };

    store
        .create_run(CreateAppAgentRunCommand {
            subject,
            session_id: "agent-session-1".to_owned(),
            run_uuid: "agent-run-uuid-user-scope".to_owned(),
            agent_id: "101".to_owned(),
            agent_version_id: "201".to_owned(),
            request_id: "req-agent-run-user-scope".to_owned(),
            trace_id: None,
            source_surface: "chat".to_owned(),
            input_message: Some("User boundary".to_owned()),
            memory_space_id: Some("memory-space-1".to_owned()),
            runtime: Some("codex".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            execution_mode: "interactive".to_owned(),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:00".to_owned(),
        })
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
            run_id,
            agent_id,
            agent_version_id,
            step_index,
            step_type,
            step_status
        )
        SELECT
            'agent-step-uuid-foreign-user',
            tenant_id,
            organization_id,
            31,
            'active',
            '2026-05-18 09:00:01',
            id,
            agent_id,
            agent_version_id,
            99,
            2,
            'completed'
        FROM ai_agent_run
        WHERE run_uuid = 'agent-run-uuid-user-scope'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let listed_steps = store
        .list_steps(subject, "agent-run-uuid-user-scope".to_owned(), 1, 20)
        .await
        .unwrap();
    assert!(listed_steps.items.is_empty());

    let own_step = store
        .create_step(CreateAppAgentRunStepCommand {
            subject,
            run_id: "agent-run-uuid-user-scope".to_owned(),
            step_uuid: "agent-step-uuid-own-user".to_owned(),
            usage_link_uuid: "agent-step-usage-link-uuid-own-user".to_owned(),
            step_type: "model".to_owned(),
            status: "running".to_owned(),
            title: Some("Own user step".to_owned()),
            model: Some("gpt-5.1-codex".to_owned()),
            runtime_invocation_id: None,
            tool_name: None,
            input_json: json!({}),
            output_json: json!({}),
            input_tokens: None,
            output_tokens: None,
            cached_tokens: None,
            reasoning_tokens: None,
            total_tokens: None,
            cost_amount: None,
            currency: None,
            usage_fact_id: None,
            usage_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:02".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(1, own_step.step_index);

    let listed_steps = store
        .list_steps(subject, "agent-run-uuid-user-scope".to_owned(), 1, 20)
        .await
        .unwrap();
    assert_eq!(1, listed_steps.items.len());
    assert_eq!("agent-step-uuid-own-user", listed_steps.items[0].id);

    let completed = store
        .complete_run(CompleteAppAgentRunCommand {
            subject,
            run_id: "agent-run-uuid-user-scope".to_owned(),
            usage_link_uuid: "agent-run-usage-link-uuid-user-scope".to_owned(),
            status: "completed".to_owned(),
            output_message: Some("User-scoped complete".to_owned()),
            error_message_masked: None,
            input_tokens: None,
            output_tokens: None,
            cached_tokens: None,
            reasoning_tokens: None,
            total_tokens: None,
            cost_amount: None,
            currency: None,
            usage_fact_id: None,
            usage_json: json!({}),
            metadata: json!({}),
            requested_at: "2026-05-18 09:00:03".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(1, completed.total_steps);
}

async fn create_agent_run_tables(pool: &sqlx::SqlitePool) {
    for statement in AGENT_RUN_SCHEMA.split(';') {
        let statement = statement.trim();
        if !statement.is_empty() {
            sqlx::query(statement).execute(pool).await.unwrap();
        }
    }
}

async fn seed_agent_session(pool: &sqlx::SqlitePool) {
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
            chat_conversation_id,
            memory_space_id,
            runtime,
            cwd,
            sandbox_policy,
            approval_policy,
            permission_mode,
            default_model,
            run_count,
            step_count,
            last_run_id,
            last_step_id,
            last_active_at,
            tool_call_count,
            created_at,
            updated_at,
            metadata
        )
        VALUES ('agent-session-uuid-1', 10, 20, 30, '101', '201', 'agent-session-1', 'Agent session', 'coding', 'chat', 'active', NULL, 'memory-space-1', 'codex', NULL, NULL, NULL, NULL, 'gpt-5.1-codex', 0, 0, NULL, NULL, NULL, 0, '2026-05-18 08:00:00', '2026-05-18 08:00:00', '{}')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_runtime_invocations(pool: &sqlx::SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO ai_runtime_invocation (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id
        )
        VALUES
            ('runtime-invocation-1', 10, 20, 30, 'agent-session-1', NULL, NULL),
            ('runtime-invocation-1', 10, 20, 31, 'agent-session-1', 'other-run', 'other-step')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_runtime_invocation_event (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            invocation_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            event_no,
            event_type,
            event_source,
            created_at
        )
        SELECT
            'runtime-event-1',
            tenant_id,
            organization_id,
            user_id,
            id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            1,
            'response.output_text.delta',
            'provider',
            '2026-05-18 08:30:00'
        FROM ai_runtime_invocation
        WHERE uuid = 'runtime-invocation-1'
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_runtime_artifact (
            uuid,
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            runtime_invocation_id,
            artifact_type,
            name,
            created_at
        )
        SELECT
            'runtime-artifact-1',
            tenant_id,
            organization_id,
            user_id,
            agent_session_id,
            agent_run_id,
            agent_run_step_id,
            uuid,
            'file',
            'summary.md',
            '2026-05-18 08:31:00'
        FROM ai_runtime_invocation
        WHERE uuid = 'runtime-invocation-1'
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

const AGENT_RUN_SCHEMA: &str = r#"
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
    run_count INTEGER NOT NULL DEFAULT 0,
    step_count INTEGER NOT NULL DEFAULT 0,
    last_run_id TEXT,
    last_step_id INTEGER,
    last_active_at TEXT,
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
    memory_space_id TEXT,
    runtime TEXT,
    model TEXT,
    run_uuid TEXT NOT NULL,
    run_status TEXT NOT NULL,
    source_surface TEXT,
    input_message TEXT,
    output_message TEXT,
    target_modality INTEGER,
    planner_model TEXT,
    execution_mode TEXT,
    started_at TEXT,
    completed_at TEXT,
    cancelled_at TEXT,
    failed_at TEXT,
    error_message_masked TEXT,
    metering_status INTEGER,
    usage_fact_id INTEGER,
    usage_json TEXT,
    total_steps INTEGER,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    cached_tokens INTEGER,
    total_tokens INTEGER,
    image_count INTEGER,
    audio_seconds TEXT,
    video_seconds TEXT
);
CREATE UNIQUE INDEX uk_ai_agent_run_request ON ai_agent_run (tenant_id, organization_id, request_id);
CREATE TABLE ai_agent_run_step (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER,
    request_id TEXT,
    trace_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT NOT NULL DEFAULT '{}',
    run_id INTEGER NOT NULL,
    agent_id INTEGER,
    agent_version_id INTEGER,
    step_index INTEGER NOT NULL,
    step_type INTEGER NOT NULL,
    step_status TEXT NOT NULL,
    title TEXT,
    tool_binding_id INTEGER,
    tool_name TEXT,
    skill_id INTEGER,
    mcp_server_id INTEGER,
    model TEXT,
    runtime_invocation_id TEXT,
    input_snapshot TEXT,
    output_snapshot TEXT,
    usage_json TEXT,
    error_message_masked TEXT,
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
);
CREATE UNIQUE INDEX uk_ai_agent_run_step_index ON ai_agent_run_step (tenant_id, organization_id, run_id, step_index);
CREATE TABLE ai_runtime_invocation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    agent_session_id TEXT,
    agent_run_id TEXT,
    agent_run_step_id TEXT
);
CREATE TABLE ai_runtime_usage_link (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    conversation_id TEXT,
    chat_turn_id TEXT,
    chat_item_id TEXT,
    message_id TEXT,
    agent_session_id TEXT,
    agent_run_id TEXT,
    agent_run_step_id TEXT,
    runtime_invocation_id TEXT,
    usage_fact_id INTEGER,
    usage_type TEXT NOT NULL,
    provider TEXT,
    model TEXT,
    request_id TEXT,
    trace_id TEXT,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cached_tokens INTEGER NOT NULL DEFAULT 0,
    reasoning_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    cost_amount TEXT,
    currency TEXT,
    occurred_at TEXT NOT NULL,
    metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE UNIQUE INDEX uk_ai_runtime_usage_link_agent_run_scope
    ON ai_runtime_usage_link (tenant_id, organization_id, user_id, agent_run_id, usage_type, COALESCE(agent_run_step_id, ''));
CREATE TABLE ai_runtime_invocation_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    invocation_id INTEGER NOT NULL,
    agent_session_id TEXT,
    agent_run_id TEXT,
    agent_run_step_id TEXT,
    event_no INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    event_source TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE ai_runtime_artifact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    agent_session_id TEXT,
    agent_run_id TEXT,
    agent_run_step_id TEXT,
    runtime_invocation_id TEXT,
    artifact_type TEXT NOT NULL,
    name TEXT,
    created_at TEXT NOT NULL
);
"#;
