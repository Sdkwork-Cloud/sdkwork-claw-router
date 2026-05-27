mod common;
use common::InternalTrustedSubjectHeaders;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AppAgentSessionFuture, AppAgentSessionItem, AppAgentSessionList, AppAgentSessionStore,
    AppAgentSessionSubject, CreateAppAgentSessionCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_agent_session_create_route_creates_resumable_session_with_memory_binding() {
    let store = Arc::new(TestAppAgentSessionStore::default());
    let router = sdkwork_claw_product::api::app_agent_session_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec!["agent-session-uuid-1"])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/agents/agent-1/sessions")
                .header("content-type", "application/json")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::from(
                    r#"{
                      "title":"Schema design agent session",
                      "agentVersionId":"agent-version-1",
                      "sessionKind":"coding",
                      "sourceSurface":"chat",
                      "chatConversationId":"chat-conversation-1",
                      "memorySpaceId":"memory-space-1",
                      "runtime":"codex",
                      "cwd":"D:/javasource/spring-ai-plus",
                      "sandboxPolicy":"workspace-write",
                      "approvalPolicy":"on-request",
                      "permissionMode":"default",
                      "defaultModel":"gpt-5.1-codex"
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("agent-session-1", payload["data"]["item"]["id"]);
    assert_eq!("agent-1", payload["data"]["item"]["agentId"]);
    assert_eq!("coding", payload["data"]["item"]["sessionKind"]);
    assert_eq!("memory-space-1", payload["data"]["item"]["memorySpaceId"]);
    assert_eq!("codex", payload["data"]["item"]["runtime"]);
    assert_eq!("agent-run-1", payload["data"]["item"]["lastRunId"]);
    assert_eq!(42, payload["data"]["item"]["lastStepId"]);
    assert_eq!(
        "2026-05-18T00:00:00Z",
        payload["data"]["item"]["lastActiveAt"]
    );
    assert_eq!(0, payload["data"]["item"]["toolCallCount"]);

    let commands = store.create_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!(10, commands[0].subject.tenant_id);
    assert_eq!(20, commands[0].subject.organization_id);
    assert_eq!(30, commands[0].subject.user_id);
    assert_eq!("agent-1", commands[0].agent_id);
    assert_eq!(
        "agent-version-1",
        commands[0].agent_version_id.as_deref().unwrap()
    );
    assert_eq!("agent-session-uuid-1", commands[0].session_uuid);
    assert_eq!("coding", commands[0].session_kind);
    assert_eq!("chat", commands[0].source_surface);
    assert_eq!(
        "chat-conversation-1",
        commands[0].chat_conversation_id.as_deref().unwrap()
    );
    assert_eq!(
        "memory-space-1",
        commands[0].memory_space_id.as_deref().unwrap()
    );
    assert_eq!("codex", commands[0].runtime.as_deref().unwrap());
    assert_eq!(
        "workspace-write",
        commands[0].sandbox_policy.as_deref().unwrap()
    );
    assert_eq!(
        "on-request",
        commands[0].approval_policy.as_deref().unwrap()
    );
    assert_eq!(
        "gpt-5.1-codex",
        commands[0].default_model.as_deref().unwrap()
    );
}

#[tokio::test]
async fn app_agent_session_list_route_uses_product_agent_namespace() {
    let store = Arc::new(TestAppAgentSessionStore::default());
    let router = sdkwork_claw_product::api::app_agent_session_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents/agent-1/sessions")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(1, payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("agent-session-1", payload["data"]["items"][0]["id"]);

    let list_requests = store.list_requests.lock().unwrap();
    assert_eq!(1, list_requests.len());
    assert_eq!("agent-1", list_requests[0].1);
    assert_eq!(30, list_requests[0].0.user_id);
}

#[tokio::test]
async fn app_agent_session_detail_route_returns_session_snapshot() {
    let store = Arc::new(TestAppAgentSessionStore::default());
    let router = sdkwork_claw_product::api::app_agent_session_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/agents/sessions/agent-session-1")
                .internal_trusted_subject(10, 20, 30)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("agent-session-1", payload["data"]["id"]);
    assert_eq!("agent-1", payload["data"]["agentId"]);
}

#[derive(Default)]
struct TestAppAgentSessionStore {
    create_commands: Mutex<Vec<CreateAppAgentSessionCommand>>,
    list_requests: Mutex<Vec<(AppAgentSessionSubject, String)>>,
}

impl AppAgentSessionStore for TestAppAgentSessionStore {
    fn list_sessions<'a>(
        &'a self,
        subject: AppAgentSessionSubject,
        agent_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionList> {
        Box::pin(async move {
            self.list_requests.lock().unwrap().push((subject, agent_id));
            Ok(AppAgentSessionList {
                items: vec![sample_session()],
            })
        })
    }

    fn get_session<'a>(
        &'a self,
        _subject: AppAgentSessionSubject,
        _session_id: String,
    ) -> AppAgentSessionFuture<'a, Option<AppAgentSessionItem>> {
        Box::pin(async { Ok(Some(sample_session())) })
    }

    fn create_session<'a>(
        &'a self,
        command: CreateAppAgentSessionCommand,
    ) -> AppAgentSessionFuture<'a, AppAgentSessionItem> {
        Box::pin(async move {
            self.create_commands.lock().unwrap().push(command);
            Ok(sample_session())
        })
    }
}

fn sample_session() -> AppAgentSessionItem {
    AppAgentSessionItem {
        id: "agent-session-1".to_owned(),
        agent_id: "agent-1".to_owned(),
        agent_version_id: Some("agent-version-1".to_owned()),
        title: "Schema design agent session".to_owned(),
        session_kind: "coding".to_owned(),
        source_surface: "chat".to_owned(),
        status: "active".to_owned(),
        chat_conversation_id: Some("chat-conversation-1".to_owned()),
        memory_space_id: Some("memory-space-1".to_owned()),
        runtime: Some("codex".to_owned()),
        cwd: Some("D:/javasource/spring-ai-plus".to_owned()),
        sandbox_policy: Some("workspace-write".to_owned()),
        approval_policy: Some("on-request".to_owned()),
        permission_mode: Some("default".to_owned()),
        default_model: Some("gpt-5.1-codex".to_owned()),
        last_run_id: Some("agent-run-1".to_owned()),
        last_step_id: Some(42),
        last_active_at: Some("2026-05-18T00:00:00Z".to_owned()),
        run_count: 0,
        step_count: 0,
        tool_call_count: 0,
        created_at: "2026-05-18T00:00:00Z".to_owned(),
        updated_at: "2026-05-18T00:00:00Z".to_owned(),
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
