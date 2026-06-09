mod common;
use common::InternalTrustedSubjectHeaders;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AppAgentRunFuture, AppAgentRunItem, AppAgentRunList, AppAgentRunStepItem, AppAgentRunStepList,
    AppAgentRunStore, AppAgentRunSubject, CompleteAppAgentRunCommand,
    CompleteAppAgentRunStepCommand, CreateAppAgentRunCommand, CreateAppAgentRunStepCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_agent_run_create_route_creates_run_under_session_with_memory_and_runtime_binding() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-run-uuid-1",
            "server-request-id-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/sessions/agent-session-1/runs")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "agentId":"101",
                      "agentVersionId":"201",
                      "traceId":"trace-agent-run-1",
                      "sourceSurface":"chat",
                      "inputMessage":"Refine the chat schema",
                      "memorySpaceId":"memory-space-1",
                      "runtime":"codex",
                      "model":"gpt-5.1-codex",
                      "executionMode":"interactive",
                      "metadata":{"surface":"chat"}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("agent-run-1", payload["data"]["item"]["id"]);
    assert_eq!("agent-session-1", payload["data"]["item"]["sessionId"]);
    assert_eq!("server-request-id-1", payload["data"]["item"]["requestId"]);
    assert_eq!("memory-space-1", payload["data"]["item"]["memorySpaceId"]);
    assert_eq!("codex", payload["data"]["item"]["runtime"]);

    let commands = store.create_run_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!(10, commands[0].subject.tenant_id);
    assert_eq!(20, commands[0].subject.organization_id);
    assert_eq!(30, commands[0].subject.user_id);
    assert_eq!("agent-session-1", commands[0].session_id);
    assert_eq!("agent-run-uuid-1", commands[0].run_uuid);
    assert_eq!("101", commands[0].agent_id);
    assert_eq!("201", commands[0].agent_version_id);
    assert_eq!("server-request-id-1", commands[0].request_id);
    assert_eq!(
        "trace-agent-run-1",
        commands[0].trace_id.as_deref().unwrap()
    );
    assert_eq!("chat", commands[0].source_surface);
    assert_eq!(
        "Refine the chat schema",
        commands[0].input_message.as_deref().unwrap()
    );
    assert_eq!(
        "memory-space-1",
        commands[0].memory_space_id.as_deref().unwrap()
    );
    assert_eq!("codex", commands[0].runtime.as_deref().unwrap());
    assert_eq!("gpt-5.1-codex", commands[0].model.as_deref().unwrap());
    assert_eq!("interactive", commands[0].execution_mode);
}

#[tokio::test]
async fn app_agent_run_create_route_generates_request_id_when_client_omits_it() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-run-uuid-1",
            "server-request-id-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/sessions/agent-session-1/runs")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "agentId":"101",
                      "agentVersionId":"201",
                      "sourceSurface":"playground",
                      "inputMessage":"Generate without a client request id"
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);

    let commands = store.create_run_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!("agent-run-uuid-1", commands[0].run_uuid);
    assert_eq!("server-request-id-1", commands[0].request_id);
    assert_eq!("server-request-id-1", payload["data"]["item"]["requestId"]);
}

#[tokio::test]
async fn app_agent_run_create_route_accepts_standard_agent_resource_ids() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-run-uuid-1",
            "server-request-id-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/sessions/agent-session-1/runs")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "agentId":"agent-1",
                      "agentVersionId":"agent-version-1",
                      "sourceSurface":"playground",
                      "inputMessage":"Run the standard playground agent",
                      "runtime":"openai_compatible",
                      "model":"gpt-5.1",
                      "executionMode":"interactive"
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);

    let commands = store.create_run_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!("agent-1", commands[0].agent_id);
    assert_eq!("agent-version-1", commands[0].agent_version_id);
    assert_eq!("server-request-id-1", commands[0].request_id);
    assert_eq!("playground", commands[0].source_surface);
    assert_eq!("openai_compatible", commands[0].runtime.as_deref().unwrap());
}

#[tokio::test]
async fn app_agent_run_step_route_records_ordered_runtime_step() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-step-uuid-1",
            "agent-step-usage-link-uuid-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/runs/agent-run-1/steps")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "stepType":"model",
                      "status":"running",
                      "title":"Plan schema changes",
                      "model":"gpt-5.1-codex",
                      "runtimeInvocationId":"runtime-invocation-1",
                      "toolName":"codex",
                      "inputJson":{"prompt":"plan"},
                      "outputJson":{"delta":"ok"},
                      "usageJson":{"inputTokens":11,"outputTokens":7},
                      "metadata":{"phase":"planning"}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("agent-step-1", payload["data"]["item"]["id"]);
    assert_eq!("agent-run-1", payload["data"]["item"]["runId"]);
    assert_eq!(1, payload["data"]["item"]["stepIndex"]);
    assert_eq!(
        "runtime-invocation-1",
        payload["data"]["item"]["runtimeInvocationId"]
    );

    let commands = store.create_step_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!("agent-run-1", commands[0].run_id);
    assert_eq!("agent-step-uuid-1", commands[0].step_uuid);
    assert_eq!("agent-step-usage-link-uuid-1", commands[0].usage_link_uuid);
    assert_eq!("model", commands[0].step_type);
    assert_eq!("running", commands[0].status);
    assert_eq!(
        "runtime-invocation-1",
        commands[0].runtime_invocation_id.as_deref().unwrap()
    );
    assert_eq!("codex", commands[0].tool_name.as_deref().unwrap());
    assert_eq!(11, commands[0].input_tokens.unwrap());
    assert_eq!(7, commands[0].output_tokens.unwrap());
    assert_eq!(18, commands[0].total_tokens.unwrap());
}

#[tokio::test]
async fn app_agent_run_routes_list_detail_steps_and_complete_run() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-run-usage-link-uuid-1",
        ])),
    );

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents/sessions/agent-session-1/runs?page=1&page_size=20")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("agent-run-1", payload["data"]["items"][0]["id"]);

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents/runs/agent-run-1")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("agent-session-1", payload["data"]["sessionId"]);

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents/runs/agent-run-1/steps")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("agent-step-1", payload["data"]["items"][0]["id"]);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/runs/agent-run-1/complete")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "status":"completed",
                      "outputMessage":"Schema completed",
                      "errorMessageMasked":null,
                      "usageJson":{"inputTokens":11,"outputTokens":7,"cachedTokens":2}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("completed", payload["data"]["item"]["status"]);
    assert_eq!("Schema completed", payload["data"]["item"]["outputMessage"]);

    let completions = store.complete_run_commands.lock().unwrap();
    assert_eq!(1, completions.len());
    assert_eq!("agent-run-1", completions[0].run_id);
    assert_eq!(
        "agent-run-usage-link-uuid-1",
        completions[0].usage_link_uuid
    );
    assert_eq!("completed", completions[0].status);
    assert_eq!(
        "Schema completed",
        completions[0].output_message.as_deref().unwrap()
    );
    assert_eq!(11, completions[0].input_tokens.unwrap());
    assert_eq!(7, completions[0].output_tokens.unwrap());
    assert_eq!(2, completions[0].cached_tokens.unwrap());
    assert_eq!(20, completions[0].total_tokens.unwrap());
}

#[tokio::test]
async fn app_agent_run_step_complete_route_records_terminal_step_status() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-step-usage-link-uuid-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/runs/agent-run-1/steps/agent-step-1/complete")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "status":"completed",
                      "outputJson":{"outputText":"Schema completed"},
                      "usageJson":{"inputTokens":11,"outputTokens":7,"cachedTokens":2},
                      "metadata":{"completed":true}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("agent-step-1", payload["data"]["item"]["id"]);
    assert_eq!("completed", payload["data"]["item"]["status"]);
    assert_eq!(
        "2026-05-18 09:00:30",
        payload["data"]["item"]["completedAt"]
    );

    let commands = store.complete_step_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!(10, commands[0].subject.tenant_id);
    assert_eq!(20, commands[0].subject.organization_id);
    assert_eq!(30, commands[0].subject.user_id);
    assert_eq!("agent-run-1", commands[0].run_id);
    assert_eq!("agent-step-1", commands[0].step_id);
    assert_eq!("agent-step-usage-link-uuid-1", commands[0].usage_link_uuid);
    assert_eq!("completed", commands[0].status);
    assert_eq!(11, commands[0].input_tokens.unwrap());
    assert_eq!(7, commands[0].output_tokens.unwrap());
    assert_eq!(2, commands[0].cached_tokens.unwrap());
    assert_eq!(20, commands[0].total_tokens.unwrap());
}

#[tokio::test]
async fn app_agent_run_complete_rejects_non_numeric_usage_fact_id() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-run-usage-link-uuid-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/runs/agent-run-1/complete")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "status":"completed",
                      "usageFactId":"usage-fact-abc",
                      "usageJson":{"inputTokens":11}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert_eq!(
        "usageFactId must be a positive integer string",
        payload["msg"]
    );
    assert_eq!(None, payload.get("message"));
    assert!(store.complete_run_commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn app_agent_run_step_rejects_non_numeric_usage_fact_id() {
    let store = Arc::new(TestAppAgentRunStore::default());
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "agent-step-uuid-1",
            "agent-step-usage-link-uuid-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/runs/agent-run-1/steps")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "stepType":"model",
                      "usageFactId":"usage-fact-abc",
                      "usageJson":{"inputTokens":11}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert_eq!(
        "usageFactId must be a positive integer string",
        payload["msg"]
    );
    assert_eq!(None, payload.get("message"));
    assert!(store.create_step_commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn app_agent_run_does_not_expose_playground_backend_namespace() {
    let router = sdkwork_claw_product::api::app_agent_run_router_with_store(
        Arc::new(TestAppAgentRunStore::default()),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/playground/agents/runs")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}

#[derive(Default)]
struct TestAppAgentRunStore {
    create_run_commands: Mutex<Vec<CreateAppAgentRunCommand>>,
    create_step_commands: Mutex<Vec<CreateAppAgentRunStepCommand>>,
    complete_step_commands: Mutex<Vec<CompleteAppAgentRunStepCommand>>,
    complete_run_commands: Mutex<Vec<CompleteAppAgentRunCommand>>,
}

impl AppAgentRunStore for TestAppAgentRunStore {
    fn list_runs<'a>(
        &'a self,
        _subject: AppAgentRunSubject,
        _session_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunList> {
        Box::pin(async {
            Ok(AppAgentRunList {
                items: vec![sample_run()],
            })
        })
    }

    fn get_run<'a>(
        &'a self,
        _subject: AppAgentRunSubject,
        _run_id: String,
    ) -> AppAgentRunFuture<'a, Option<AppAgentRunItem>> {
        Box::pin(async { Ok(Some(sample_run())) })
    }

    fn create_run<'a>(
        &'a self,
        command: CreateAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem> {
        Box::pin(async move {
            let request_id = command.request_id.clone();
            self.create_run_commands.lock().unwrap().push(command);
            Ok(AppAgentRunItem {
                request_id,
                ..sample_run()
            })
        })
    }

    fn complete_run<'a>(
        &'a self,
        command: CompleteAppAgentRunCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunItem> {
        Box::pin(async move {
            self.complete_run_commands.lock().unwrap().push(command);
            Ok(AppAgentRunItem {
                status: "completed".to_owned(),
                output_message: Some("Schema completed".to_owned()),
                completed_at: Some("2026-05-18 09:00:30".to_owned()),
                total_steps: 1,
                input_tokens: Some(11),
                output_tokens: Some(7),
                cached_tokens: Some(2),
                total_tokens: Some(20),
                ..sample_run()
            })
        })
    }

    fn list_steps<'a>(
        &'a self,
        _subject: AppAgentRunSubject,
        _run_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepList> {
        Box::pin(async {
            Ok(AppAgentRunStepList {
                items: vec![sample_step()],
            })
        })
    }

    fn create_step<'a>(
        &'a self,
        command: CreateAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem> {
        Box::pin(async move {
            self.create_step_commands.lock().unwrap().push(command);
            Ok(sample_step())
        })
    }

    fn complete_step<'a>(
        &'a self,
        command: CompleteAppAgentRunStepCommand,
    ) -> AppAgentRunFuture<'a, AppAgentRunStepItem> {
        Box::pin(async move {
            self.complete_step_commands.lock().unwrap().push(command);
            Ok(AppAgentRunStepItem {
                status: "completed".to_owned(),
                completed_at: Some("2026-05-18 09:00:30".to_owned()),
                cached_tokens: Some(2),
                total_tokens: Some(20),
                ..sample_step()
            })
        })
    }
}

fn sample_run() -> AppAgentRunItem {
    AppAgentRunItem {
        id: "agent-run-1".to_owned(),
        session_id: Some("agent-session-1".to_owned()),
        agent_id: "101".to_owned(),
        agent_version_id: "201".to_owned(),
        request_id: "req-agent-run-1".to_owned(),
        trace_id: Some("trace-agent-run-1".to_owned()),
        status: "running".to_owned(),
        source_surface: "chat".to_owned(),
        input_message: Some("Refine the chat schema".to_owned()),
        output_message: None,
        memory_space_id: Some("memory-space-1".to_owned()),
        runtime: Some("codex".to_owned()),
        model: Some("gpt-5.1-codex".to_owned()),
        execution_mode: "interactive".to_owned(),
        started_at: Some("2026-05-18 09:00:00".to_owned()),
        completed_at: None,
        error_message_masked: None,
        total_steps: 0,
        input_tokens: None,
        output_tokens: None,
        cached_tokens: None,
        total_tokens: None,
        created_at: "2026-05-18 09:00:00".to_owned(),
    }
}

fn sample_step() -> AppAgentRunStepItem {
    AppAgentRunStepItem {
        id: "agent-step-1".to_owned(),
        run_id: "agent-run-1".to_owned(),
        step_index: 1,
        step_type: "model".to_owned(),
        status: "running".to_owned(),
        title: Some("Plan schema changes".to_owned()),
        model: Some("gpt-5.1-codex".to_owned()),
        runtime_invocation_id: Some("runtime-invocation-1".to_owned()),
        tool_name: Some("codex".to_owned()),
        input_tokens: Some(11),
        output_tokens: Some(7),
        cached_tokens: None,
        total_tokens: Some(18),
        started_at: Some("2026-05-18 09:00:05".to_owned()),
        completed_at: None,
        latency_ms: None,
        created_at: "2026-05-18 09:00:05".to_owned(),
    }
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Debug)]
struct SequentialUuidGenerator {
    values: Mutex<Vec<String>>,
}

impl SequentialUuidGenerator {
    fn new(values: Vec<&str>) -> Self {
        Self {
            values: Mutex::new(values.into_iter().rev().map(str::to_owned).collect()),
        }
    }
}

impl EntityUuidGenerator for SequentialUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok(self
            .values
            .lock()
            .unwrap()
            .pop()
            .unwrap_or_else(|| "generated-uuid".to_owned()))
    }
}
