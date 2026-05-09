use axum::body::Body;
use axum::http::{Method, Request, StatusCode};
use serde_json::Value;
use tower::ServiceExt;

async fn call(method: Method, uri: &str) -> (StatusCode, Value) {
    let response = sdkwork_claw_admin_api::router()
        .oneshot(
            Request::builder()
                .method(method)
                .uri(uri)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let status = response.status();
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload = serde_json::from_slice(&body).unwrap_or(Value::Null);
    (status, payload)
}

#[tokio::test]
async fn backend_contract_routes_return_standard_not_implemented_envelope() {
    let cases = [
        (Method::POST, "/backend/v3/api/model/list", "fetchModels"),
        (
            Method::POST,
            "/backend/v3/api/router/models/sync",
            "syncVendorsAndModels",
        ),
        (
            Method::PATCH,
            "/backend/v3/api/router/announcements/notice-001",
            "updateAnnouncement",
        ),
    ];

    for (method, path, operation) in cases {
        let (status, payload) = call(method, path).await;

        assert_eq!(StatusCode::NOT_IMPLEMENTED, status, "{path}");
        assert_eq!("5010", payload["code"], "{path}");
        assert_eq!("Not implemented", payload["msg"], "{path}");
        assert_eq!(operation, payload["data"]["operation"], "{path}");
        assert_eq!("backend", payload["data"]["apiSurface"], "{path}");
        assert_eq!(path, payload["data"]["apiPath"], "{path}");
    }
}

#[tokio::test]
async fn unknown_backend_route_still_returns_not_found() {
    let response = sdkwork_claw_admin_api::router()
        .oneshot(
            Request::builder()
                .uri("/backend/v3/api/not-in-contract")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}
