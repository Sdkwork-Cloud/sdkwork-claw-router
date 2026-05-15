use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;
use std::sync::Mutex;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::api::app_store_router_with_read_store;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AppStoreItem, AppStoreQuery, AppStoreReadFuture, AppStoreReadStore, AppStoreReleaseItem,
    AppStoreSubject,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_store_catalog_route_returns_sdk_contract_items() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store?search_query=router&page=1&page_size=20")
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
    assert_eq!("SUCCESS", payload["message"]);
    assert_eq!(1, payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("claw-router", payload["data"]["items"][0]["id"]);
    assert_eq!("Claw Router", payload["data"]["items"][0]["name"]);
    assert_eq!("SDKWork", payload["data"]["items"][0]["developer"]);
    assert_eq!("Developer Tools", payload["data"]["items"][0]["category"]);
    assert_eq!(4.8, payload["data"]["items"][0]["rating"]);
    assert_eq!("12.5K", payload["data"]["items"][0]["downloads"]);
    assert_eq!(
        "Unified API router",
        payload["data"]["items"][0]["description"]
    );
    assert_eq!(
        "https://cdn.example.test/app-cover.png",
        payload["data"]["items"][0]["image"]
    );
    assert_eq!(
        "Reliable routing",
        payload["data"]["items"][0]["features"][0]
    );
    assert_eq!(
        "https://cdn.example.test/app-screen.png",
        payload["data"]["items"][0]["screenshots"][0]
    );
    assert_eq!(
        "Desktop",
        payload["data"]["items"][0]["releases"][0]["platformType"]
    );
    assert_eq!("Windows", payload["data"]["items"][0]["releases"][0]["os"]);
    assert_eq!(
        "https://download.example.test/claw-router.exe",
        payload["data"]["items"][0]["releases"][0]["downloadUrl"]
    );
}

#[tokio::test]
async fn app_store_detail_route_returns_direct_item_data() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store/claw-router")
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
    assert_eq!("claw-router", payload["data"]["id"]);
    assert_eq!("Claw Router", payload["data"]["name"]);
    assert!(
        payload["data"]["items"].is_null(),
        "detail data must be the direct SDK AppDetailResponse object"
    );
}

#[tokio::test]
async fn app_store_categories_route_returns_string_items() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store/categories")
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
    assert_eq!("Developer Tools", payload["data"]["items"][0]);
    assert_eq!("Productivity", payload["data"]["items"][1]);
}

#[tokio::test]
async fn app_store_detail_route_reports_missing_app_as_not_found() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store/missing-app")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
    let payload = response_json(response).await;
    assert_eq!("4004", payload["code"]);
}

#[tokio::test]
async fn app_store_catalog_route_rejects_unsupported_status_values() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    for status in [
        "PUBLISHED",
        "OFFLINE",
        "ENABLED",
        "DISABLED",
        "1",
        "0",
        "active",
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .uri(format!("/app/v3/api/platform/apps/store?status={status}"))
                    .header("x-sdkwork-tenant-id", "10")
                    .header("x-sdkwork-organization-id", "20")
                    .header("x-sdkwork-user-id", "30")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(StatusCode::BAD_REQUEST, response.status(), "{status}");
        let payload = response_json(response).await;
        assert_eq!("4001", payload["code"]);
        assert!(payload["message"]
            .as_str()
            .unwrap_or_default()
            .contains("status must be ACTIVE or INACTIVE"));
    }
}

#[tokio::test]
async fn app_store_catalog_route_rejects_invalid_time_window_values() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store?start_time=2026-99-02T09:30:00Z")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["message"]
        .as_str()
        .unwrap_or_default()
        .contains("start_time must be an ISO-8601 date-time"));
}

#[tokio::test]
async fn app_store_catalog_route_rejects_non_ascii_time_window_without_panic() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store?start_time=202%C3%A9-05-0")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["message"]
        .as_str()
        .unwrap_or_default()
        .contains("start_time must be an ISO-8601 date-time"));
}

#[tokio::test]
async fn app_store_catalog_route_rejects_ambiguous_time_zone_offsets() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store?start_time=2026-05-02T09:30:00%2B08:00")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["message"]
        .as_str()
        .unwrap_or_default()
        .contains("start_time must use UTC Z or no timezone offset"));
}

#[tokio::test]
async fn app_store_catalog_route_rejects_inverted_time_windows() {
    let router = app_store_router_with_read_store(Arc::new(FixedAppStoreReadStore));

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store?start_time=2026-05-04&end_time=2026-05-03")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["message"]
        .as_str()
        .unwrap_or_default()
        .contains("start_time must be earlier than or equal to end_time"));
}

#[tokio::test]
async fn app_store_catalog_route_accepts_standard_status_and_normalizes_time_window_query() {
    let store = Arc::new(CapturingAppStoreReadStore::default());
    let router = app_store_router_with_read_store(store.clone());

    let response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/platform/apps/store?status=ACTIVE&start_time=2026-05-02T09:30:45Z&end_time=2026-05-03")
                .header("x-sdkwork-tenant-id", "10")
                .header("x-sdkwork-organization-id", "20")
                .header("x-sdkwork-user-id", "30")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let captured = store.take_last_query().expect("query should be captured");
    assert_eq!(Some("ACTIVE".to_owned()), captured.status);
    assert_eq!(Some("2026-05-02 09:30:45".to_owned()), captured.start_time);
    assert_eq!(Some("2026-05-03 23:59:59".to_owned()), captured.end_time);
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

struct FixedAppStoreReadStore;

#[derive(Default)]
struct CapturingAppStoreReadStore {
    queries: Mutex<Vec<AppStoreQuery>>,
}

impl CapturingAppStoreReadStore {
    fn take_last_query(&self) -> Option<AppStoreQuery> {
        self.queries.lock().unwrap().pop()
    }
}

impl AppStoreReadStore for FixedAppStoreReadStore {
    fn load_apps<'a>(
        &'a self,
        _query: AppStoreQuery,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<AppStoreItem>> {
        async_result(vec![app_item()])
    }

    fn load_app_by_id<'a>(
        &'a self,
        app_id: String,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Option<AppStoreItem>> {
        async_result(if app_id == "claw-router" {
            Some(app_item())
        } else {
            None
        })
    }

    fn load_categories<'a>(
        &'a self,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<String>> {
        async_result(vec![
            "Developer Tools".to_owned(),
            "Productivity".to_owned(),
        ])
    }
}

impl AppStoreReadStore for CapturingAppStoreReadStore {
    fn load_apps<'a>(
        &'a self,
        query: AppStoreQuery,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<AppStoreItem>> {
        self.queries.lock().unwrap().push(query);
        async_result(vec![app_item()])
    }

    fn load_app_by_id<'a>(
        &'a self,
        _app_id: String,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Option<AppStoreItem>> {
        async_result(Some(app_item()))
    }

    fn load_categories<'a>(
        &'a self,
        _subject: Option<AppStoreSubject>,
    ) -> AppStoreReadFuture<'a, Vec<String>> {
        async_result(vec![
            "Developer Tools".to_owned(),
            "Productivity".to_owned(),
        ])
    }
}

fn async_result<'a, T: Send + 'a>(
    value: T,
) -> Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>> {
    Box::pin(async move { Ok(value) })
}

fn app_item() -> AppStoreItem {
    AppStoreItem {
        id: "claw-router".to_owned(),
        name: "Claw Router".to_owned(),
        developer: "SDKWork".to_owned(),
        category: "Developer Tools".to_owned(),
        image: "https://cdn.example.test/app-cover.png".to_owned(),
        rating: 4.8,
        description: "Unified API router".to_owned(),
        downloads: "12.5K".to_owned(),
        screenshots: vec!["https://cdn.example.test/app-screen.png".to_owned()],
        features: vec!["Reliable routing".to_owned()],
        releases: vec![AppStoreReleaseItem {
            id: "windows-x64".to_owned(),
            platform_type: "Desktop".to_owned(),
            os: "Windows".to_owned(),
            version: "1.2.3".to_owned(),
            size: "82 MB".to_owned(),
            release_date: "2026-05-01".to_owned(),
            download_url: "https://download.example.test/claw-router.exe".to_owned(),
            whats_new: Some("Stable release".to_owned()),
        }],
    }
}
