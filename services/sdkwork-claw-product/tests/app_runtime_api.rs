use std::convert::Infallible;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use bytes::Bytes;
use futures_util::stream;
use futures_util::StreamExt as FuturesStreamExt;
use http_body_util::BodyExt;
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AppRuntimeArtifactItem, AppRuntimeArtifactList, AppRuntimeEventItem, AppRuntimeEventList,
    AppRuntimeFuture, AppRuntimeInvocationExecution, AppRuntimeInvocationItem,
    AppRuntimeInvocationList, AppRuntimeStore, AppRuntimeSubject, ChatCompletionRelayRequest,
    ChatCompletionStreamRelay, ChatCompletionStreamRelayResponse,
    CompleteAppRuntimeInvocationCommand, CreateAppRuntimeArtifactCommand,
    CreateAppRuntimeEventCommand, CreateAppRuntimeInvocationCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_runtime_create_invocation_uses_product_runtime_namespace_and_store_contract() {
    let store = Arc::new(TestAppRuntimeStore::default());
    let router = sdkwork_claw_product::api::app_runtime_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "runtime-invocation-uuid-1",
        ])),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/runtime/invocations")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{
                      "invocationType":"chat_response",
                      "runtime":"claude_code",
                      "endpoint":"messages.create",
                      "status":"running",
                      "conversationId":"chat-conversation-1",
                      "chatTurnId":"chat-turn-1",
                      "agentSessionId":"agent-session-1",
                      "requestId":"req-1",
                      "traceId":"trace-1",
                      "model":"claude-sonnet-4-5",
                      "provider":"anthropic",
                      "streaming":true,
                      "requestJson":{"prompt":"hello"},
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
    assert_eq!("runtime-invocation-1", payload["data"]["item"]["id"]);
    assert_eq!("claude_code", payload["data"]["item"]["runtime"]);

    let commands = store.create_invocation_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!(10, commands[0].subject.tenant_id);
    assert_eq!(20, commands[0].subject.organization_id);
    assert_eq!(30, commands[0].subject.user_id);
    assert_eq!("runtime-invocation-uuid-1", commands[0].invocation_uuid);
    assert_eq!("chat_response", commands[0].invocation_type);
    assert_eq!("claude_code", commands[0].runtime);
    assert_eq!(
        "chat-conversation-1",
        commands[0].conversation_id.as_deref().unwrap()
    );
    assert_eq!("chat-turn-1", commands[0].chat_turn_id.as_deref().unwrap());
    assert_eq!(
        "agent-session-1",
        commands[0].agent_session_id.as_deref().unwrap()
    );
    assert!(commands[0].streaming);
}

#[tokio::test]
async fn app_runtime_records_events_and_artifacts_under_invocation() {
    let store = Arc::new(TestAppRuntimeStore::default());
    let router = sdkwork_claw_product::api::app_runtime_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "runtime-event-uuid-1",
            "runtime-artifact-uuid-1",
        ])),
    );

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/events")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{
                      "eventType":"response.output_text.delta",
                      "eventSource":"provider",
                      "payloadJson":{"delta":"hello"},
                      "textDelta":"hello",
                      "metadata":{"sequence":"first"}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("runtime-event-1", payload["data"]["item"]["id"]);
    assert_eq!(
        "runtime-invocation-1",
        payload["data"]["item"]["invocationId"]
    );
    assert_eq!("hello", payload["data"]["item"]["payloadJson"]["delta"]);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/artifacts")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r##"{
                      "artifactType":"file",
                      "name":"summary.md",
                      "mimeType":"text/markdown",
                      "contentText":"# Summary",
                      "contentJson":{"kind":"markdown"},
                      "storageKey":"runtime/runtime-invocation-1/summary.md",
                      "sha256":"abc123",
                      "sizeBytes":9,
                      "metadata":{"source":"codex"}
                    }"##,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("runtime-artifact-1", payload["data"]["item"]["id"]);
    assert_eq!("summary.md", payload["data"]["item"]["name"]);

    let event_commands = store.create_event_commands.lock().unwrap();
    assert_eq!(1, event_commands.len());
    assert_eq!("runtime-invocation-1", event_commands[0].invocation_id);
    assert_eq!("response.output_text.delta", event_commands[0].event_type);
    assert_eq!("provider", event_commands[0].event_source);

    let artifact_commands = store.create_artifact_commands.lock().unwrap();
    assert_eq!(1, artifact_commands.len());
    assert_eq!("runtime-invocation-1", artifact_commands[0].invocation_id);
    assert_eq!("file", artifact_commands[0].artifact_type);
    assert_eq!("summary.md", artifact_commands[0].name.as_deref().unwrap());
}

#[tokio::test]
async fn app_runtime_lists_invocations_events_and_artifacts_for_trusted_subject() {
    let store = Arc::new(TestAppRuntimeStore::default());
    let router = sdkwork_claw_product::api::app_runtime_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/runtime/invocations?conversationId=chat-conversation-1&page=1&pageSize=20")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("runtime-invocation-1", payload["data"]["items"][0]["id"]);

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/events")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("runtime-event-1", payload["data"]["items"][0]["id"]);
    assert_eq!("hello", payload["data"]["items"][0]["payloadJson"]["delta"]);

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/artifacts")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("runtime-artifact-1", payload["data"]["items"][0]["id"]);

    let subjects = store.list_invocation_subjects.lock().unwrap();
    assert_eq!(
        vec![AppRuntimeSubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30
        }],
        *subjects
    );
}

#[tokio::test]
async fn app_runtime_streams_invocation_events_as_sse_for_trusted_subject() {
    let store = Arc::new(TestAppRuntimeStore::default());
    let router = sdkwork_claw_product::api::app_runtime_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/events/stream")
                .header("accept", "text/event-stream")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    assert_eq!(
        Some("text/event-stream"),
        response
            .headers()
            .get(axum::http::header::CONTENT_TYPE)
            .and_then(|value| value.to_str().ok())
    );

    let body = response_text(response).await;
    assert!(body.contains("data: {"));
    assert!(body.contains(r#""id":"runtime-event-1""#));
    assert!(body.contains(r#""textDelta":"hello""#));
    assert!(body.contains(r#""payloadJson":{"delta":"hello"}"#));
    assert!(body.ends_with("data: [DONE]\n\n"));

    let subjects = store.list_event_subjects.lock().unwrap();
    assert_eq!(
        vec![AppRuntimeSubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30
        }],
        *subjects
    );
}

#[tokio::test]
async fn app_runtime_stream_executes_openai_compatible_invocation_and_persists_delta_events() {
    let store = Arc::new(TestAppRuntimeStore::with_invocation(
        AppRuntimeInvocationRecord {
            item: AppRuntimeInvocationItem {
                status: "streaming".to_owned(),
                runtime: "openai_compatible".to_owned(),
                endpoint: Some("chat.stream".to_owned()),
                model: Some("openai/global/gpt-4o-mini".to_owned()),
                provider: Some("openai".to_owned()),
                ..sample_invocation()
            },
            request_json: serde_json::json!({
                "messages": [{"role": "user", "content": "ping"}],
                "routeKeyId": 101,
                "streamOptions": {"includeUsage": true}
            }),
            metadata: serde_json::json!({"surface": "playground"}),
        },
    ));
    store.list_events_items.lock().unwrap().clear();
    let relay_requests = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::app_runtime_router_with_store_and_chat_stream_relay(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "runtime-event-uuid-1",
            "runtime-event-uuid-2",
        ])),
        Arc::new(TestRuntimeCatalog::default()),
        Arc::new(RecordingStreamRelay::new(Arc::clone(&relay_requests))),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/events/stream")
                .header("accept", "text/event-stream")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = response_text(response).await;
    assert!(body.contains(r#""id":"runtime-event-1""#), "{body}");
    assert!(body.contains(r#""textDelta":"hello""#), "{body}");
    assert!(body.contains(r#""id":"runtime-event-2""#), "{body}");
    assert!(body.contains(r#""textDelta":" world""#), "{body}");
    assert!(body.ends_with("data: [DONE]\n\n"), "{body}");

    let relay_requests = relay_requests.lock().unwrap();
    assert_eq!(1, relay_requests.len());
    assert_eq!(101, relay_requests[0].api_key_id);
    assert_eq!(10, relay_requests[0].tenant_id);
    assert_eq!(20, relay_requests[0].organization_id);
    assert_eq!(30, relay_requests[0].user_id);
    assert_eq!("openai/global/gpt-4o-mini", relay_requests[0].model);
    assert_eq!("provider-gpt-4o-mini", relay_requests[0].provider_model);
    assert_eq!(true, relay_requests[0].request_body["stream"]);
    assert_eq!(
        true,
        relay_requests[0].request_body["stream_options"]["include_usage"]
    );
    assert_eq!(
        "ping",
        relay_requests[0].request_body["messages"][0]["content"]
    );

    let event_commands = store.create_event_commands.lock().unwrap();
    assert_eq!(2, event_commands.len());
    assert_eq!("runtime-invocation-1", event_commands[0].invocation_id);
    assert_eq!("response.output_text.delta", event_commands[0].event_type);
    assert_eq!("provider", event_commands[0].event_source);
    assert_eq!("hello", event_commands[0].text_delta.as_deref().unwrap());
    assert_eq!(" world", event_commands[1].text_delta.as_deref().unwrap());
}

#[tokio::test]
async fn app_runtime_stream_flushes_runtime_events_before_provider_stream_finishes() {
    let store = Arc::new(TestAppRuntimeStore::with_invocation(
        AppRuntimeInvocationRecord {
            item: AppRuntimeInvocationItem {
                status: "streaming".to_owned(),
                runtime: "openai_compatible".to_owned(),
                endpoint: Some("agent.stream".to_owned()),
                model: Some("openai/global/gpt-4o-mini".to_owned()),
                provider: Some("openai".to_owned()),
                ..sample_invocation()
            },
            request_json: serde_json::json!({
                "prompt": "stream now",
                "routeKeyId": 101
            }),
            metadata: serde_json::json!({"surface": "playground"}),
        },
    ));
    store.list_events_items.lock().unwrap().clear();
    let router = sdkwork_claw_product::api::app_runtime_router_with_store_and_chat_stream_relay(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(vec![
            "runtime-event-uuid-1",
            "runtime-event-uuid-2",
        ])),
        Arc::new(TestRuntimeCatalog::default()),
        Arc::new(SlowStreamRelay),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/events/stream")
                .header("accept", "text/event-stream")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let mut body = response.into_body();
    let first = tokio::time::timeout(Duration::from_millis(100), body.frame())
        .await
        .expect("first runtime SSE event should flush before delayed provider completion")
        .expect("first runtime SSE frame is required")
        .unwrap();
    let first_text = String::from_utf8(first.into_data().unwrap().to_vec()).unwrap();
    assert!(
        first_text.contains(r#""textDelta":"first""#),
        "{first_text}"
    );
    assert!(!first_text.contains("[DONE]"), "{first_text}");

    let remaining = axum::body::to_bytes(body, usize::MAX).await.unwrap();
    let remaining = String::from_utf8(remaining.to_vec()).unwrap();
    assert!(
        remaining.contains(r#""textDelta":" second""#),
        "{remaining}"
    );
    assert!(remaining.ends_with("data: [DONE]\n\n"), "{remaining}");
}

#[tokio::test]
async fn app_runtime_complete_invocation_updates_status_and_response_snapshot() {
    let store = Arc::new(TestAppRuntimeStore::default());
    let router = sdkwork_claw_product::api::app_runtime_router_with_store(
        store.clone(),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/runtime/invocations/runtime-invocation-1/complete")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{
                      "status":"completed",
                      "providerResponseId":"msg_123",
                      "finishReason":"stop",
                      "latencyMs":1200,
                      "ttftMs":200,
                      "exitCode":0,
                      "responseJson":{"id":"msg_123"},
                      "usageJson":{"inputTokens":10,"outputTokens":20}
                    }"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("completed", payload["data"]["item"]["status"]);

    let commands = store.complete_invocation_commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!("runtime-invocation-1", commands[0].invocation_id);
    assert_eq!("completed", commands[0].status);
    assert_eq!(
        "msg_123",
        commands[0].provider_response_id.as_deref().unwrap()
    );
    assert_eq!(1200, commands[0].latency_ms.unwrap());
}

#[tokio::test]
async fn app_runtime_does_not_expose_playground_backend_namespace() {
    let router = sdkwork_claw_product::api::app_runtime_router_with_store(
        Arc::new(TestAppRuntimeStore::default()),
        Arc::new(SequentialUuidGenerator::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/playground/runtime/invocations")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}

struct TestAppRuntimeStore {
    create_invocation_commands: Mutex<Vec<CreateAppRuntimeInvocationCommand>>,
    complete_invocation_commands: Mutex<Vec<CompleteAppRuntimeInvocationCommand>>,
    create_event_commands: Mutex<Vec<CreateAppRuntimeEventCommand>>,
    create_artifact_commands: Mutex<Vec<CreateAppRuntimeArtifactCommand>>,
    list_invocation_subjects: Mutex<Vec<AppRuntimeSubject>>,
    list_event_subjects: Mutex<Vec<AppRuntimeSubject>>,
    invocation: Mutex<AppRuntimeInvocationRecord>,
    list_events_items: Mutex<Vec<AppRuntimeEventItem>>,
}

impl TestAppRuntimeStore {
    fn with_invocation(invocation: AppRuntimeInvocationRecord) -> Self {
        Self {
            invocation: Mutex::new(invocation),
            ..Self::default()
        }
    }
}

impl Default for TestAppRuntimeStore {
    fn default() -> Self {
        Self {
            create_invocation_commands: Mutex::new(Vec::new()),
            complete_invocation_commands: Mutex::new(Vec::new()),
            create_event_commands: Mutex::new(Vec::new()),
            create_artifact_commands: Mutex::new(Vec::new()),
            list_invocation_subjects: Mutex::new(Vec::new()),
            list_event_subjects: Mutex::new(Vec::new()),
            invocation: Mutex::new(AppRuntimeInvocationRecord::default()),
            list_events_items: Mutex::new(vec![sample_event()]),
        }
    }
}

impl AppRuntimeStore for TestAppRuntimeStore {
    fn list_invocations<'a>(
        &'a self,
        subject: AppRuntimeSubject,
        _query: sdkwork_claw_product::ports::AppRuntimeInvocationQuery,
    ) -> AppRuntimeFuture<'a, AppRuntimeInvocationList> {
        Box::pin(async move {
            self.list_invocation_subjects.lock().unwrap().push(subject);
            Ok(AppRuntimeInvocationList {
                items: vec![sample_invocation()],
            })
        })
    }

    fn get_invocation<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _invocation_id: String,
    ) -> AppRuntimeFuture<'a, Option<AppRuntimeInvocationItem>> {
        Box::pin(async move { Ok(Some(self.invocation.lock().unwrap().item.clone())) })
    }

    fn get_invocation_execution<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _invocation_id: String,
    ) -> AppRuntimeFuture<'a, Option<AppRuntimeInvocationExecution>> {
        Box::pin(async move {
            let invocation = self.invocation.lock().unwrap().clone();
            Ok(Some(AppRuntimeInvocationExecution {
                item: invocation.item,
                request_json: invocation.request_json,
                metadata: invocation.metadata,
            }))
        })
    }

    fn create_invocation<'a>(
        &'a self,
        command: CreateAppRuntimeInvocationCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeInvocationItem> {
        Box::pin(async move {
            self.create_invocation_commands
                .lock()
                .unwrap()
                .push(command);
            Ok(sample_invocation())
        })
    }

    fn complete_invocation<'a>(
        &'a self,
        command: CompleteAppRuntimeInvocationCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeInvocationItem> {
        Box::pin(async move {
            self.complete_invocation_commands
                .lock()
                .unwrap()
                .push(command);
            Ok(AppRuntimeInvocationItem {
                status: "completed".to_owned(),
                provider_response_id: Some("msg_123".to_owned()),
                finish_reason: Some("stop".to_owned()),
                latency_ms: Some(1200),
                ttft_ms: Some(200),
                exit_code: Some(0),
                ..sample_invocation()
            })
        })
    }

    fn list_events<'a>(
        &'a self,
        subject: AppRuntimeSubject,
        _invocation_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppRuntimeFuture<'a, AppRuntimeEventList> {
        Box::pin(async move {
            self.list_event_subjects.lock().unwrap().push(subject);
            Ok(AppRuntimeEventList {
                items: self.list_events_items.lock().unwrap().clone(),
            })
        })
    }

    fn create_event<'a>(
        &'a self,
        command: CreateAppRuntimeEventCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeEventItem> {
        Box::pin(async move {
            self.create_event_commands
                .lock()
                .unwrap()
                .push(command.clone());
            let event = AppRuntimeEventItem {
                id: if command.event_uuid.ends_with("-2") {
                    "runtime-event-2".to_owned()
                } else {
                    "runtime-event-1".to_owned()
                },
                invocation_id: command.invocation_id,
                event_no: self.create_event_commands.lock().unwrap().len() as i64,
                event_type: command.event_type,
                event_source: command.event_source,
                payload_json: command.payload_json,
                text_delta: command.text_delta,
                created_at: command.requested_at,
            };
            self.list_events_items.lock().unwrap().push(event.clone());
            Ok(event)
        })
    }

    fn list_artifacts<'a>(
        &'a self,
        _subject: AppRuntimeSubject,
        _invocation_id: String,
        _page: i64,
        _page_size: i64,
    ) -> AppRuntimeFuture<'a, AppRuntimeArtifactList> {
        Box::pin(async {
            Ok(AppRuntimeArtifactList {
                items: vec![sample_artifact()],
            })
        })
    }

    fn create_artifact<'a>(
        &'a self,
        command: CreateAppRuntimeArtifactCommand,
    ) -> AppRuntimeFuture<'a, AppRuntimeArtifactItem> {
        Box::pin(async move {
            self.create_artifact_commands.lock().unwrap().push(command);
            Ok(sample_artifact())
        })
    }
}

#[derive(Clone)]
struct AppRuntimeInvocationRecord {
    item: AppRuntimeInvocationItem,
    request_json: Value,
    metadata: Value,
}

impl Default for AppRuntimeInvocationRecord {
    fn default() -> Self {
        Self {
            item: sample_invocation(),
            request_json: serde_json::json!({"prompt":"hello"}),
            metadata: serde_json::json!({}),
        }
    }
}

fn sample_invocation() -> AppRuntimeInvocationItem {
    AppRuntimeInvocationItem {
        id: "runtime-invocation-1".to_owned(),
        invocation_no: 1,
        invocation_type: "chat_response".to_owned(),
        runtime: "claude_code".to_owned(),
        endpoint: Some("messages.create".to_owned()),
        attempt_no: 1,
        status: "running".to_owned(),
        conversation_id: Some("chat-conversation-1".to_owned()),
        chat_turn_id: Some("chat-turn-1".to_owned()),
        chat_item_id: None,
        agent_session_id: Some("agent-session-1".to_owned()),
        agent_run_id: None,
        agent_run_step_id: None,
        request_id: Some("req-1".to_owned()),
        trace_id: Some("trace-1".to_owned()),
        provider_response_id: None,
        provider_session_id: None,
        provider_conversation_id: None,
        provider_step_id: None,
        model: Some("claude-sonnet-4-5".to_owned()),
        provider: Some("anthropic".to_owned()),
        tool_name: None,
        tool_call_id: None,
        cwd: None,
        sandbox_policy: None,
        approval_policy: None,
        permission_mode: None,
        streaming: true,
        started_at: Some("2026-05-18 09:00:00".to_owned()),
        completed_at: None,
        latency_ms: None,
        ttft_ms: None,
        exit_code: None,
        finish_reason: None,
        error_type: None,
        error_code: None,
        error_message_masked: None,
        created_at: "2026-05-18 09:00:00".to_owned(),
    }
}

fn sample_event() -> AppRuntimeEventItem {
    AppRuntimeEventItem {
        id: "runtime-event-1".to_owned(),
        invocation_id: "runtime-invocation-1".to_owned(),
        event_no: 1,
        event_type: "response.output_text.delta".to_owned(),
        event_source: "provider".to_owned(),
        payload_json: serde_json::json!({"delta":"hello"}),
        text_delta: Some("hello".to_owned()),
        created_at: "2026-05-18 09:00:01".to_owned(),
    }
}

#[derive(Debug, Default)]
struct TestRuntimeCatalog;

impl sdkwork_claw_product::ports::PricingCatalog for TestRuntimeCatalog {
    fn list_models(
        &self,
        _vendor_code: Option<&str>,
    ) -> Vec<sdkwork_claw_product::domain::AiModel> {
        vec![sdkwork_claw_product::domain::AiModel::new(
            "gpt-4o-mini",
            "GPT-4o mini",
            "openai",
            vec!["chat"],
        )]
    }

    fn list_provider_routes(
        &self,
        model: &str,
    ) -> Vec<sdkwork_claw_product::domain::ModelProviderRoute> {
        if model != "openai/global/gpt-4o-mini" {
            return Vec::new();
        }
        vec![
            sdkwork_claw_product::domain::ModelProviderRoute::new_for_catalog_key(
                "openai/global/gpt-4o-mini",
                "gpt-4o-mini",
                "openai",
                3001,
                "provider-gpt-4o-mini",
            )
            .with_provider_endpoint(Some("https://provider.example/v1"), Some("secret-ref")),
        ]
    }

    fn list_provider_account_pool_routes(
        &self,
    ) -> Vec<sdkwork_claw_product::domain::ProviderAccountPoolRoute> {
        vec![
            sdkwork_claw_product::domain::ProviderAccountPoolRoute::new("openai", 3001)
                .with_provider_endpoint(Some("https://provider.example/v1"), Some("secret-ref")),
        ]
    }

    fn list_routing_policies(&self) -> Vec<sdkwork_claw_product::domain::RoutingPolicy> {
        vec![sdkwork_claw_product::domain::RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-chat",
            sdkwork_claw_product::domain::RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(9101),
        )
        .with_capability(sdkwork_claw_product::domain::RoutingCapability::Chat)]
    }

    fn list_routing_rules(
        &self,
        profile_id: i64,
    ) -> Vec<sdkwork_claw_product::domain::RoutingRule> {
        if profile_id != 9101 {
            return Vec::new();
        }
        vec![sdkwork_claw_product::domain::RoutingRule::new(
            9102,
            10,
            20,
            9101,
            "openai-chat",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![sdkwork_claw_product::domain::RouteCandidate::new(
            3001, 100,
        )])]
    }

    fn list_api_keys(&self) -> Vec<sdkwork_claw_product::domain::GatewayApiKey> {
        vec![
            sdkwork_claw_product::domain::GatewayApiKey::new(101, 10, "sk-app", "hash")
                .with_owner(10, 20, 30),
        ]
    }

    fn list_api_key_groups(&self) -> Vec<sdkwork_claw_product::domain::ApiKeyGroup> {
        vec![sdkwork_claw_product::domain::ApiKeyGroup::new(
            10,
            "standard",
            "standard",
            sdkwork_claw_product::domain::DecimalValue::parse("1.000000").unwrap(),
            sdkwork_claw_product::domain::DecimalValue::parse("1.000000").unwrap(),
        )]
    }

    fn list_model_prices(
        &self,
        _model: &str,
        _price_side: sdkwork_claw_product::domain::PriceSide,
        _billing_meter: sdkwork_claw_product::domain::BillingMeter,
    ) -> Vec<sdkwork_claw_product::domain::ModelPrice> {
        Vec::new()
    }

    fn list_model_prices_for_side(
        &self,
        _model: &str,
        _price_side: sdkwork_claw_product::domain::PriceSide,
    ) -> Vec<sdkwork_claw_product::domain::ModelPrice> {
        Vec::new()
    }

    fn find_api_key(&self, api_key_id: i64) -> Option<sdkwork_claw_product::domain::GatewayApiKey> {
        self.list_api_keys()
            .into_iter()
            .find(|api_key| api_key.id == api_key_id)
    }

    fn find_api_key_by_hash(
        &self,
        _key_hash: &str,
    ) -> Option<sdkwork_claw_product::domain::GatewayApiKey> {
        None
    }

    fn find_api_key_group(
        &self,
        group_id: i64,
    ) -> Option<sdkwork_claw_product::domain::ApiKeyGroup> {
        self.list_api_key_groups()
            .into_iter()
            .find(|group| group.id == group_id)
    }

    fn find_access_policy(
        &self,
        _policy_id: i64,
    ) -> Option<sdkwork_claw_product::domain::GatewayAccessPolicy> {
        None
    }

    fn find_quota_policy(
        &self,
        _policy_id: i64,
    ) -> Option<sdkwork_claw_product::domain::QuotaPolicy> {
        None
    }

    fn find_latest_api_key_group_metric_snapshot(
        &self,
        _group_id: i64,
    ) -> Option<sdkwork_claw_product::domain::ApiKeyGroupMetricSnapshot> {
        None
    }

    fn find_pricing_plan(
        &self,
        plan_code: &str,
    ) -> Option<sdkwork_claw_product::domain::PricingPlan> {
        (plan_code == "standard").then(|| {
            sdkwork_claw_product::domain::PricingPlan::new(
                "standard",
                sdkwork_claw_product::domain::PriceSide::OfficialReference,
                sdkwork_claw_product::domain::DecimalValue::parse("1.000000").unwrap(),
                sdkwork_claw_product::domain::Money::usd("0.000000").unwrap(),
            )
        })
    }

    fn find_model(&self, model: &str) -> Option<sdkwork_claw_product::domain::AiModel> {
        self.list_models(None)
            .into_iter()
            .find(|candidate| candidate.catalog_key == model || candidate.model == model)
    }

    fn find_vendor(
        &self,
        vendor_code: &str,
    ) -> Option<sdkwork_claw_product::domain::ModelVendorDefinition> {
        (vendor_code == "openai").then(|| {
            sdkwork_claw_product::domain::ModelVendorDefinition::new(
                "openai",
                sdkwork_claw_product::domain::ModelVendor::OpenAi,
                "OpenAI",
            )
        })
    }

    fn find_provider_route(
        &self,
        model: &str,
        provider_code: &str,
    ) -> Option<sdkwork_claw_product::domain::ModelProviderRoute> {
        self.list_provider_routes(model)
            .into_iter()
            .find(|route| route.provider_code == provider_code)
    }

    fn find_model_price(
        &self,
        model: &str,
        price_side: sdkwork_claw_product::domain::PriceSide,
        billing_meter: sdkwork_claw_product::domain::BillingMeter,
        provider_code: Option<&str>,
        pricing_plan_code: Option<&str>,
    ) -> Option<sdkwork_claw_product::domain::ModelPrice> {
        if model != "openai/global/gpt-4o-mini"
            || price_side != sdkwork_claw_product::domain::PriceSide::OfficialReference
            || billing_meter != sdkwork_claw_product::domain::BillingMeter::LlmInputToken
            || provider_code.is_some()
            || pricing_plan_code.is_some()
        {
            return None;
        }
        Some(
            sdkwork_claw_product::domain::ModelPrice::new_for_catalog_key(
                "openai/global/gpt-4o-mini",
                "gpt-4o-mini",
                sdkwork_claw_product::domain::PriceSide::OfficialReference,
                sdkwork_claw_product::domain::BillingMeter::LlmInputToken,
                sdkwork_claw_product::domain::Money::usd("0.150000").unwrap(),
            ),
        )
    }
}

#[derive(Debug)]
struct RecordingStreamRelay {
    captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
}

impl RecordingStreamRelay {
    fn new(captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>) -> Self {
        Self { captured }
    }
}

impl ChatCompletionStreamRelay for RecordingStreamRelay {
    fn create_chat_completion_stream<'a>(
        &'a self,
        request: ChatCompletionRelayRequest,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = sdkwork_claw_product::domain::DomainResult<
                        ChatCompletionStreamRelayResponse,
                    >,
                > + Send
                + 'a,
        >,
    > {
        self.captured.lock().unwrap().push(request);
        Box::pin(async {
            Ok(ChatCompletionStreamRelayResponse::new(
                200,
                Some("text/event-stream".to_owned()),
                Body::from(
                    "data: {\"id\":\"chatcmpl-stream\",\"choices\":[{\"delta\":{\"content\":\"hello\"}}]}\n\n\
                     data: {\"id\":\"chatcmpl-stream\",\"choices\":[{\"delta\":{\"content\":\" world\"},\"finish_reason\":\"stop\"}]}\n\n\
                     data: [DONE]\n\n",
                ),
            ))
        })
    }
}

#[derive(Debug)]
struct SlowStreamRelay;

impl ChatCompletionStreamRelay for SlowStreamRelay {
    fn create_chat_completion_stream<'a>(
        &'a self,
        _request: ChatCompletionRelayRequest,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = sdkwork_claw_product::domain::DomainResult<
                        ChatCompletionStreamRelayResponse,
                    >,
                > + Send
                + 'a,
        >,
    > {
        Box::pin(async {
            let chunks = stream::iter(vec![
                Ok::<_, Infallible>(Bytes::from_static(
                    b"data: {\"choices\":[{\"delta\":{\"content\":\"first\"}}]}\n\n",
                )),
                Ok::<_, Infallible>(Bytes::from_static(
                    b"data: {\"choices\":[{\"delta\":{\"content\":\" second\"}}]}\n\n",
                )),
                Ok::<_, Infallible>(Bytes::from_static(b"data: [DONE]\n\n")),
            ])
            .then(|chunk| async move {
                if chunk.as_ref().is_ok_and(|bytes| {
                    bytes.starts_with(b"data: {\"choices\":[{\"delta\":{\"content\":\" second\"")
                }) {
                    tokio::time::sleep(Duration::from_millis(250)).await;
                }
                chunk
            });
            Ok(ChatCompletionStreamRelayResponse::new(
                200,
                Some("text/event-stream".to_owned()),
                Body::from_stream(chunks),
            ))
        })
    }
}

fn sample_artifact() -> AppRuntimeArtifactItem {
    AppRuntimeArtifactItem {
        id: "runtime-artifact-1".to_owned(),
        invocation_id: "runtime-invocation-1".to_owned(),
        artifact_type: "file".to_owned(),
        name: Some("summary.md".to_owned()),
        mime_type: Some("text/markdown".to_owned()),
        content_text: Some("# Summary".to_owned()),
        storage_key: Some("runtime/runtime-invocation-1/summary.md".to_owned()),
        storage_url: None,
        sha256: Some("abc123".to_owned()),
        size_bytes: Some(9),
        created_at: "2026-05-18 09:00:02".to_owned(),
    }
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

async fn response_text(response: axum::response::Response) -> String {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    String::from_utf8(body.to_vec()).unwrap()
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
