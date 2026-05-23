use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::domain::DomainError;
use sdkwork_claw_product::ports::{
    AppGenerationHistoryItem, AppGenerationHistoryReadFuture, AppGenerationHistoryReadStore,
    AppGenerationHistorySubject,
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
            model_catalog_key: Some("image-pro".to_owned()),
            url: Some("https://cdn.example.test/assets/asset-1.png".to_owned()),
            images: vec!["https://cdn.example.test/assets/asset-1.png".to_owned()],
            videos: Vec::new(),
            aspect_ratio: Some("16:9".to_owned()),
            duration_seconds: None,
            status: Some("completed".to_owned()),
            output_text: Some("Generated image".to_owned()),
            created_at: Some("2026-05-03 10:00:00".to_owned()),
            updated_at: Some("2026-05-03 10:01:00".to_owned()),
        },
        AppGenerationHistoryItem {
            id: "job-2".to_owned(),
            date: "2026-05-03".to_owned(),
            prompt: "launch explainer".to_owned(),
            item_type: "video".to_owned(),
            model_info: Some("video-pro".to_owned()),
            model_catalog_key: Some("video-pro".to_owned()),
            url: None,
            images: Vec::new(),
            videos: vec![sdkwork_claw_product::ports::AppGenerationMediaItem {
                url: "https://cdn.example.test/assets/job-2.mp4".to_owned(),
                thumb: Some("https://cdn.example.test/assets/job-2.jpg".to_owned()),
            }],
            aspect_ratio: Some("16:9".to_owned()),
            duration_seconds: Some(5),
            status: Some("completed".to_owned()),
            output_text: Some("Generated video".to_owned()),
            created_at: Some("2026-05-03 09:00:00".to_owned()),
            updated_at: Some("2026-05-03 09:05:00".to_owned()),
        },
        AppGenerationHistoryItem {
            id: "agent-text-3".to_owned(),
            date: "2026-05-03".to_owned(),
            prompt: "summarize launch plan".to_owned(),
            item_type: "text".to_owned(),
            model_info: Some("llm-pro".to_owned()),
            model_catalog_key: Some("llm-pro".to_owned()),
            url: None,
            images: Vec::new(),
            videos: Vec::new(),
            aspect_ratio: None,
            duration_seconds: None,
            status: Some("completed".to_owned()),
            output_text: Some("Generated text".to_owned()),
            created_at: Some("2026-05-03 08:00:00".to_owned()),
            updated_at: Some("2026-05-03 08:01:00".to_owned()),
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
    assert_eq!(3, payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("asset-1", payload["data"]["items"][0]["id"]);
    assert_eq!("image", payload["data"]["items"][0]["type"]);
    assert_eq!(
        "https://cdn.example.test/assets/asset-1.png",
        payload["data"]["items"][0]["images"][0]
    );
    assert_eq!("image-pro", payload["data"]["items"][0]["modelCatalogKey"]);
    assert_eq!("16:9", payload["data"]["items"][0]["aspectRatio"]);
    assert_eq!("Generated image", payload["data"]["items"][0]["outputText"]);
    assert_eq!("job-2", payload["data"]["items"][1]["id"]);
    assert_eq!("video", payload["data"]["items"][1]["type"]);
    assert_eq!(
        "https://cdn.example.test/assets/job-2.mp4",
        payload["data"]["items"][1]["videos"][0]["url"]
    );
    assert_eq!(5, payload["data"]["items"][1]["durationSeconds"]);
    assert_eq!("Generated video", payload["data"]["items"][1]["outputText"]);
    assert_eq!("agent-text-3", payload["data"]["items"][2]["id"]);
    assert_eq!("text", payload["data"]["items"][2]["type"]);
    assert!(payload["data"]["items"][2]["images"]
        .as_array()
        .unwrap()
        .is_empty());
    assert!(payload["data"]["items"][2]["videos"]
        .as_array()
        .unwrap()
        .is_empty());
    assert_eq!("Generated text", payload["data"]["items"][2]["outputText"]);

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
