use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::domain::DomainError;
use sdkwork_claw_product::ports::{
    AppPlaygroundHistoryItem, AppPlaygroundHistoryReadFuture, AppPlaygroundHistoryReadStore,
    AppPlaygroundHistorySubject,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn playground_history_route_returns_store_items_for_trusted_subject() {
    let store = Arc::new(TestPlaygroundHistoryStore::new(vec![
        AppPlaygroundHistoryItem {
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
        AppPlaygroundHistoryItem {
            id: "job-2".to_owned(),
            date: "2026-05-03".to_owned(),
            prompt: "launch explainer".to_owned(),
            item_type: "video".to_owned(),
            model_info: Some("video-pro".to_owned()),
            url: None,
            images: Vec::new(),
            videos: vec![sdkwork_claw_product::ports::AppPlaygroundMediaItem {
                url: "https://cdn.example.test/assets/job-2.mp4".to_owned(),
                thumb: Some("https://cdn.example.test/assets/job-2.jpg".to_owned()),
            }],
            status: Some("completed".to_owned()),
            created_at: Some("2026-05-03 09:00:00".to_owned()),
            updated_at: Some("2026-05-03 09:05:00".to_owned()),
        },
    ]));
    let router =
        sdkwork_claw_product::api::app_playground_history_router_with_read_store(store.clone());

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/playground/history")
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
        vec![AppPlaygroundHistorySubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
        }],
        *subjects
    );
}

#[tokio::test]
async fn playground_history_route_rejects_missing_trusted_subject_for_store_backed_router() {
    let router = sdkwork_claw_product::api::app_playground_history_router_with_read_store(
        Arc::new(TestPlaygroundHistoryStore::new(Vec::new())),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/playground/history")
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
struct TestPlaygroundHistoryStore {
    items: Vec<AppPlaygroundHistoryItem>,
    subjects: Mutex<Vec<AppPlaygroundHistorySubject>>,
}

impl TestPlaygroundHistoryStore {
    fn new(items: Vec<AppPlaygroundHistoryItem>) -> Self {
        Self {
            items,
            subjects: Mutex::new(Vec::new()),
        }
    }
}

impl AppPlaygroundHistoryReadStore for TestPlaygroundHistoryStore {
    fn load_playground_history<'a>(
        &'a self,
        subject: Option<AppPlaygroundHistorySubject>,
    ) -> AppPlaygroundHistoryReadFuture<'a, Vec<AppPlaygroundHistoryItem>> {
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
