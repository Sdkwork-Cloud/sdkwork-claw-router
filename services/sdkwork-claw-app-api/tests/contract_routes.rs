use axum::body::Body;
use axum::http::{Method, Request, StatusCode};
use serde_json::Value;
use tower::ServiceExt;

async fn call(method: Method, uri: &str) -> (StatusCode, Value) {
    let response = sdkwork_claw_app_api::router()
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
async fn app_contract_routes_return_standard_not_implemented_envelope() {
    let cases = [
        (Method::GET, "/app/v3/api/iam/api_keys", "fetchKeys"),
        (Method::POST, "/app/v3/api/iam/api_keys", "createKey"),
        (Method::PATCH, "/app/v3/api/iam/api_keys/key-1", "updateKey"),
        (
            Method::DELETE,
            "/app/v3/api/iam/api_keys/key-1",
            "deleteKey",
        ),
    ];

    for (method, path, operation) in cases {
        let (status, payload) = call(method, path).await;

        assert_eq!(StatusCode::NOT_IMPLEMENTED, status, "{path}");
        assert_eq!("5010", payload["code"], "{path}");
        assert_eq!("Not implemented", payload["msg"], "{path}");
        assert_eq!(operation, payload["data"]["operation"], "{path}");
        assert_eq!("app", payload["data"]["apiSurface"], "{path}");
        assert_eq!(path, payload["data"]["apiPath"], "{path}");
    }
}

#[tokio::test]
async fn app_redeem_code_route_requires_trusted_subject_with_json_body() {
    let response = sdkwork_claw_app_api::router()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/app/v3/api/billing/coupons/redeem")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"code":"WELCOME"}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    let status = response.status();
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, status);
    assert_eq!("4010", payload["code"]);
}

#[tokio::test]
async fn app_user_profile_contract_route_returns_success_envelope() {
    let (status, payload) = call(Method::GET, "/app/v3/api/iam/users/current").await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!("SUCCESS", payload["msg"]);
    assert_eq!("en-US", payload["data"]["language"]);
    assert_eq!("0", payload["data"]["thirdPartyBound"]);
}

#[tokio::test]
async fn app_store_route_is_exposed_by_default_router() {
    let (status, payload) = call(Method::GET, "/app/v3/api/platform/apps/store").await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!("SUCCESS", payload["msg"]);
    assert_eq!(0, payload["data"]["items"].as_array().unwrap().len());
}

#[tokio::test]
async fn app_commerce_foundation_routes_are_exposed_by_default_router() {
    let success_cases = [
        "/app/v3/api/billing/wallet/overview",
        "/app/v3/api/billing/account/points",
        "/app/v3/api/billing/account/points/recharges/packages",
        "/app/v3/api/billing/account/tokens",
        "/app/v3/api/billing/vip/info",
        "/app/v3/api/billing/vip/points/daily_rewards/status",
    ];

    for path in success_cases {
        let (status, payload) = call(Method::GET, path).await;

        assert_eq!(StatusCode::OK, status, "{path}");
        assert_eq!("2000", payload["code"], "{path}");
    }

    let unavailable_cases = [
        "/app/v3/api/billing/wallet/operations/request-1",
        "/app/v3/api/billing/vip/packs/pack-1",
        "/app/v3/api/billing/preflight/estimates",
    ];

    for path in unavailable_cases {
        let method = if path.ends_with("/estimates") {
            Method::POST
        } else {
            Method::GET
        };
        let (status, payload) = call(method, path).await;

        assert_eq!(StatusCode::NOT_IMPLEMENTED, status, "{path}");
        assert_eq!("5010", payload["code"], "{path}");
    }
}

#[tokio::test]
async fn legacy_commerce_app_routes_are_not_exposed_by_default_router() {
    let legacy_paths = [
        "/app/v3/api/account/summary",
        "/app/v3/api/account/points/recharge",
        "/app/v3/api/vip/pack_groups/packs",
        "/app/v3/api/payments/checkout/order-1",
        "/app/v3/api/coupons/redeem",
    ];

    for path in legacy_paths {
        let (status, _payload) = call(Method::GET, path).await;
        assert_eq!(StatusCode::NOT_FOUND, status, "{path}");
    }
}

#[tokio::test]
async fn app_skills_route_is_exposed_by_default_router() {
    let (status, payload) = call(Method::GET, "/app/v3/api/ecosystem/skills").await;

    assert_eq!(StatusCode::OK, status);
    assert_eq!("2000", payload["code"]);
    assert_eq!("SUCCESS", payload["msg"]);
    assert_eq!(0, payload["data"]["items"].as_array().unwrap().len());
}

#[tokio::test]
async fn unknown_app_route_still_returns_not_found() {
    let response = sdkwork_claw_app_api::router()
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/not-in-contract")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}
