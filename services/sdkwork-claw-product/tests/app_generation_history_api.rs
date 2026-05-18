use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::domain::DomainError;
use sdkwork_claw_product::ports::{
    AppGenerationAgentRunCommand, AppGenerationAgentRunFuture, AppGenerationAgentRunOutcome,
    AppGenerationAgentRunStore, AppGenerationHistoryItem, AppGenerationHistoryReadFuture,
    AppGenerationHistoryReadStore, AppGenerationHistorySubject,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn generation_history_route_returns_store_items_for_trusted_subject() {
    let store = Arc::new(TestGenerationHistoryStore::new(vec![
        AppGenerationHistoryItem {
            id: "asset-1".to_owned(),
            date: "2026-05-03".to_owned(),
            prompt: "commercial product dashboard".to_owned(),
            item_type: "image".to_owned(),
            model_info: Some("image-pro".to_owned()),
            url: Some("https://cdn.example.test/assets/asset-1.png".to_owned()),
            images: vec!["https://cdn.example.test/assets/asset-1.png".to_owned()],
            videos: Vec::new(),
            status: Some("completed".to_owned()),
            created_at: Some("2026-05-03 10:00:00".to_owned()),
            updated_at: Some("2026-05-03 10:01:00".to_owned()),
        },
        AppGenerationHistoryItem {
            id: "job-2".to_owned(),
            date: "2026-05-03".to_owned(),
            prompt: "launch explainer".to_owned(),
            item_type: "video".to_owned(),
            model_info: Some("video-pro".to_owned()),
            url: None,
            images: Vec::new(),
            videos: vec![sdkwork_claw_product::ports::AppGenerationMediaItem {
                url: "https://cdn.example.test/assets/job-2.mp4".to_owned(),
                thumb: Some("https://cdn.example.test/assets/job-2.jpg".to_owned()),
            }],
            status: Some("completed".to_owned()),
            created_at: Some("2026-05-03 09:00:00".to_owned()),
            updated_at: Some("2026-05-03 09:05:00".to_owned()),
        },
    ]));
    let router =
        sdkwork_claw_product::api::app_generation_history_router_with_read_store(store.clone());

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/generations")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = json_payload(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(2, payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("asset-1", payload["data"]["items"][0]["id"]);
    assert_eq!("image", payload["data"]["items"][0]["type"]);
    assert_eq!(
        "https://cdn.example.test/assets/asset-1.png",
        payload["data"]["items"][0]["images"][0]
    );
    assert_eq!("job-2", payload["data"]["items"][1]["id"]);
    assert_eq!("video", payload["data"]["items"][1]["type"]);
    assert_eq!(
        "https://cdn.example.test/assets/job-2.mp4",
        payload["data"]["items"][1]["videos"][0]["url"]
    );

    let subjects = store.subjects.lock().unwrap();
    assert_eq!(
        vec![AppGenerationHistorySubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
        }],
        *subjects
    );
}

#[tokio::test]
async fn generation_history_route_rejects_missing_trusted_subject_for_store_backed_router() {
    let router = sdkwork_claw_product::api::app_generation_history_router_with_read_store(
        Arc::new(TestGenerationHistoryStore::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/ai/generations")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4010", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("x-sdkwork-tenant-id header is required"));
}

#[tokio::test]
async fn generation_agent_route_classifies_freeform_video_prompt_and_returns_pending_history_item()
{
    let store = Arc::new(TestGenerationAgentRunStore::new());
    let router = sdkwork_claw_product::api::app_generation_agent_router_with_store(store.clone());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ai/generation/agents/runs")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(
                    r#"{"prompt":"Create a launch asset for an API router","targetType":"video","selectedModel":"kling-v2","generationConfig":{"durationSeconds":10},"referenceImages":[{"name":"storyboard.png","mimeType":"image/png","sizeBytes":1024,"dataUrl":"data:image/png;base64,ZmFrZQ==","url":"https://cdn.example.test/storyboard.png","assetId":"asset-1"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = json_payload(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("video", payload["data"]["targetType"]);
    assert_eq!("pending", payload["data"]["status"]);
    assert_eq!("default-generation-agent", payload["data"]["agent"]["id"]);
    assert_eq!("Generation Agent", payload["data"]["agent"]["name"]);
    assert_eq!("agent-run-1", payload["data"]["run"]["id"]);
    assert_eq!("generation-agent", payload["data"]["run"]["source"]);
    assert_eq!("queued", payload["data"]["run"]["status"]);
    assert_eq!("agent-run-1-step-input", payload["data"]["steps"][0]["id"]);
    assert_eq!("input", payload["data"]["steps"][0]["type"]);
    assert_eq!("succeeded", payload["data"]["steps"][0]["status"]);
    assert_eq!("token", payload["data"]["usage"]["events"][0]["type"]);
    assert_eq!("0", payload["data"]["usage"]["events"][0]["quantity"]);
    assert_eq!(
        "agent-runtime",
        payload["data"]["meteringEvents"][0]["usageFactMetadata"]["meteringSource"]
    );
    assert_eq!(
        "30",
        payload["data"]["meteringEvents"][0]["usageFactMetadata"]["userId"]
    );
    assert_eq!(
        "agent-run-1-step-input",
        payload["data"]["meteringEvents"][0]["usageFactMetadata"]["stepId"]
    );
    assert_eq!("agent-run-1", payload["data"]["item"]["id"]);
    assert_eq!("video", payload["data"]["item"]["type"]);
    assert_eq!("pending", payload["data"]["item"]["status"]);
    assert_eq!("kling-v2", payload["data"]["item"]["modelInfo"]);
    assert_eq!(
        "Create a launch asset for an API router",
        payload["data"]["item"]["prompt"]
    );
    assert_eq!(
        0,
        payload["data"]["item"]["images"].as_array().unwrap().len()
    );
    assert_eq!(
        0,
        payload["data"]["item"]["videos"].as_array().unwrap().len()
    );

    let commands = store.commands.lock().unwrap();
    assert_eq!(1, commands.len());
    assert_eq!(10, commands[0].subject.tenant_id);
    assert_eq!(20, commands[0].subject.organization_id);
    assert_eq!(30, commands[0].subject.user_id);
    assert_eq!("video", commands[0].target_type);
    assert_eq!("kling-v2", commands[0].selected_model.as_deref().unwrap());
    assert_eq!(10, commands[0].generation_config["durationSeconds"]);
    assert_eq!(1, commands[0].reference_images.len());
    assert_eq!("storyboard.png", commands[0].reference_images[0].name);
    assert_eq!(
        Some("image/png"),
        commands[0].reference_images[0].mime_type.as_deref()
    );
    assert_eq!(
        Some("data:image/png;base64,ZmFrZQ=="),
        commands[0].reference_images[0].data_url.as_deref()
    );
    assert_eq!(
        Some("https://cdn.example.test/storyboard.png"),
        commands[0].reference_images[0].url.as_deref()
    );
    assert_eq!(
        Some("asset-1"),
        commands[0].reference_images[0].asset_id.as_deref()
    );
}

#[tokio::test]
async fn generation_agent_route_rejects_blank_prompts_without_calling_store() {
    let store = Arc::new(TestGenerationAgentRunStore::new());
    let router = sdkwork_claw_product::api::app_generation_agent_router_with_store(store.clone());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ai/generation/agents/runs")
                .header("content-type", "application/json")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::from(r#"{"prompt":"   "}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("prompt is required"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn generation_agent_route_rejects_missing_trusted_subject_for_store_backed_router() {
    let router = sdkwork_claw_product::api::app_generation_agent_router_with_store(Arc::new(
        TestGenerationAgentRunStore::new(),
    ));

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/ai/generation/agents/runs")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"prompt":"Create an image"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4010", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("x-sdkwork-tenant-id header is required"));
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Debug)]
struct TestGenerationHistoryStore {
    items: Vec<AppGenerationHistoryItem>,
    subjects: Mutex<Vec<AppGenerationHistorySubject>>,
}

impl TestGenerationHistoryStore {
    fn new(items: Vec<AppGenerationHistoryItem>) -> Self {
        Self {
            items,
            subjects: Mutex::new(Vec::new()),
        }
    }
}

impl AppGenerationHistoryReadStore for TestGenerationHistoryStore {
    fn load_generation_history<'a>(
        &'a self,
        subject: Option<AppGenerationHistorySubject>,
    ) -> AppGenerationHistoryReadFuture<'a, Vec<AppGenerationHistoryItem>> {
        Box::pin(async move {
            let subject = subject.ok_or_else(|| DomainError::new("subject is required"))?;
            self.subjects
                .lock()
                .map_err(|_| DomainError::new("test subject lock poisoned"))?
                .push(subject);
            Ok(self.items.clone())
        })
    }
}

#[derive(Debug)]
struct TestGenerationAgentRunStore {
    commands: Mutex<Vec<AppGenerationAgentRunCommand>>,
}

impl TestGenerationAgentRunStore {
    fn new() -> Self {
        Self {
            commands: Mutex::new(Vec::new()),
        }
    }
}

impl AppGenerationAgentRunStore for TestGenerationAgentRunStore {
    fn create_agent_run<'a>(
        &'a self,
        command: AppGenerationAgentRunCommand,
    ) -> AppGenerationAgentRunFuture<'a, AppGenerationAgentRunOutcome> {
        Box::pin(async move {
            self.commands
                .lock()
                .map_err(|_| DomainError::new("test generation agent lock poisoned"))?
                .push(command.clone());
            Ok(AppGenerationAgentRunOutcome {
                agent: sdkwork_claw_product::ports::AppAgentSnapshot {
                    id: "default-generation-agent".to_owned(),
                    version_id: "default-generation-agent-v1".to_owned(),
                    name: "Generation Agent".to_owned(),
                    model: command.selected_model.clone(),
                },
                item: AppGenerationHistoryItem {
                    id: "agent-run-1".to_owned(),
                    date: "2026-05-17".to_owned(),
                    prompt: command.prompt,
                    item_type: command.target_type,
                    model_info: command.selected_model,
                    url: None,
                    images: Vec::new(),
                    videos: Vec::new(),
                    status: Some("pending".to_owned()),
                    created_at: Some("2026-05-17T08:00:00Z".to_owned()),
                    updated_at: Some("2026-05-17T08:00:00Z".to_owned()),
                },
                metering_events: vec![sdkwork_claw_product::ports::AppAgentMeteringEvent {
                    event_type: "token".to_owned(),
                    quantity: "0".to_owned(),
                    usage_fact_metadata: sdkwork_claw_product::ports::AppAgentUsageFactMetadata {
                        agent_id: "default-generation-agent".to_owned(),
                        agent_version_id: "default-generation-agent-v1".to_owned(),
                        metering_source: "agent-runtime".to_owned(),
                        run_id: "agent-run-1".to_owned(),
                        step_id: "agent-run-1-step-input".to_owned(),
                        user_id: command.subject.user_id.to_string(),
                        skill_id: None,
                        mcp_server_id: None,
                        tool_id: None,
                    },
                }],
                run: sdkwork_claw_product::ports::AppAgentRunSnapshot {
                    id: "agent-run-1".to_owned(),
                    request_id: command.request_id,
                    source: "generation-agent".to_owned(),
                    status: "queued".to_owned(),
                },
                steps: vec![sdkwork_claw_product::ports::AppAgentRunStepSnapshot {
                    id: "agent-run-1-step-input".to_owned(),
                    index: 0,
                    step_type: "input".to_owned(),
                    status: "succeeded".to_owned(),
                    title: "User input accepted".to_owned(),
                }],
                target_type: "video".to_owned(),
                status: "pending".to_owned(),
                usage: sdkwork_claw_product::ports::AppAgentUsageSummary {
                    cached_tokens: 0,
                    completion_tokens: 0,
                    events: vec![sdkwork_claw_product::ports::AppAgentMeteringEvent {
                        event_type: "token".to_owned(),
                        quantity: "0".to_owned(),
                        usage_fact_metadata:
                            sdkwork_claw_product::ports::AppAgentUsageFactMetadata {
                                agent_id: "default-generation-agent".to_owned(),
                                agent_version_id: "default-generation-agent-v1".to_owned(),
                                metering_source: "agent-runtime".to_owned(),
                                run_id: "agent-run-1".to_owned(),
                                step_id: "agent-run-1-step-input".to_owned(),
                                user_id: command.subject.user_id.to_string(),
                                skill_id: None,
                                mcp_server_id: None,
                                tool_id: None,
                            },
                    }],
                    image_count: 0,
                    prompt_tokens: 0,
                    total_tokens: 0,
                    video_seconds: "0".to_owned(),
                },
            })
        })
    }
}
