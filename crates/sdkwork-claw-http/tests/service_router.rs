use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_http::ApiSurface;
use tower::ServiceExt;

#[tokio::test]
async fn service_router_exposes_standard_health_and_ready_endpoints() {
    let router = sdkwork_claw_http::service_router("sdkwork-claw-app-api");

    let health = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/healthz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, health.status());

    let ready = router
        .oneshot(
            Request::builder()
                .uri("/readyz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, ready.status());
}

#[tokio::test]
async fn service_router_exposes_gateway_openapi_document() {
    let response = sdkwork_claw_http::service_router("sdkwork-claw-gateway")
        .oneshot(
            Request::builder()
                .uri("/openapi.json")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    assert_eq!(
        "public, max-age=30, stale-while-revalidate=60",
        response
            .headers()
            .get("cache-control")
            .unwrap()
            .to_str()
            .unwrap()
    );
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!("3.0.3", payload["openapi"]);
    assert_eq!("Claw Router Open API", payload["info"]["title"]);
    assert!(payload.get("x-provider-passthrough").is_none());
    let payload_text = serde_json::to_string(&payload)
        .unwrap()
        .to_ascii_lowercase();
    assert!(!payload_text.contains("passthrough"));
    assert!(!payload_text.contains("x-passthrough"));
    assert!(!payload_text.contains("native"));
    assert!(payload["paths"].get("/v1/chat/completions").is_some());
    assert!(payload["paths"].get("/v1/responses").is_some());
    assert!(payload["paths"].get("/v1/embeddings").is_some());
    assert!(payload["paths"].get("/v1/images/generations").is_some());
    assert!(payload["paths"].get("/v1/audio/speech").is_some());
    assert!(payload["paths"].get("/v1/threads").is_some());
    assert!(payload["paths"]
        .get("/google/v1beta/models/{model}:generateContent")
        .is_some());
    assert!(payload["paths"].get("/anthropic/v1/messages").is_some());
    assert!(payload["paths"].get("/suno/v1/music/generations").is_some());
    assert!(payload["paths"]
        .get("/kling/v1/videos/generations")
        .is_some());
    assert!(payload["paths"].get("/vidu/ent/v2/text2video").is_some());
    assert!(payload["paths"]
        .get("/vidu/ent/v2/reference2image")
        .is_some());
    assert!(payload["paths"]
        .get("/midjourney/v1/images/generations")
        .is_some());
    assert!(payload["paths"]
        .get("/volcengine/api/v3/contents/generations/tasks")
        .is_some());
}

#[tokio::test]
async fn service_router_exposes_ordered_openapi_schema_tabs_from_route_config() {
    let response = sdkwork_claw_http::service_router("sdkwork-claw-gateway")
        .oneshot(
            Request::builder()
                .uri("/openapi/schema-tabs.json")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    assert_eq!(
        "public, max-age=30, stale-while-revalidate=60",
        response
            .headers()
            .get("cache-control")
            .unwrap()
            .to_str()
            .unwrap()
    );

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(30, payload["cacheTtlSeconds"]);
    assert_eq!(3, payload["tabs"].as_array().unwrap().len());
    assert_eq!("gateway", payload["tabs"][0]["id"]);
    assert_eq!("Claw Router Open API", payload["tabs"][0]["name"]);
    assert_eq!(10, payload["tabs"][0]["order"]);
    assert_eq!("/openapi.json", payload["tabs"][0]["defaultSchemaUrl"]);
    assert_eq!("/openapi.json", payload["tabs"][0]["schemaUrls"][0]);
    assert_eq!("app", payload["tabs"][1]["id"]);
    assert_eq!(
        "/app/v3/api/openapi.json",
        payload["tabs"][1]["schemaUrls"][0]
    );
    assert_eq!("backend", payload["tabs"][2]["id"]);
    assert_eq!(
        "/backend/v3/api/openapi.json",
        payload["tabs"][2]["schemaUrls"][0]
    );
}

#[tokio::test]
async fn service_router_keeps_gateway_openapi_off_app_and_backend_root_paths() {
    let app_response = sdkwork_claw_http::service_router_with_contract_routes(
        "sdkwork-claw-app-api",
        ApiSurface::App,
    )
    .oneshot(
        Request::builder()
            .uri("/openapi.json")
            .body(Body::empty())
            .unwrap(),
    )
    .await
    .unwrap();
    assert_eq!(StatusCode::NOT_FOUND, app_response.status());

    let backend_response = sdkwork_claw_http::service_router_with_contract_routes(
        "sdkwork-claw-admin-api",
        ApiSurface::Backend,
    )
    .oneshot(
        Request::builder()
            .uri("/openapi.json")
            .body(Body::empty())
            .unwrap(),
    )
    .await
    .unwrap();
    assert_eq!(StatusCode::NOT_FOUND, backend_response.status());
}

#[tokio::test]
async fn service_router_exposes_surface_openapi_documents() {
    let app_response = sdkwork_claw_http::service_router_with_contract_routes(
        "sdkwork-claw-app-api",
        ApiSurface::App,
    )
    .oneshot(
        Request::builder()
            .uri("/app/v3/api/openapi.json")
            .body(Body::empty())
            .unwrap(),
    )
    .await
    .unwrap();
    assert_eq!(StatusCode::OK, app_response.status());
    assert_eq!(
        "public, max-age=30, stale-while-revalidate=60",
        app_response
            .headers()
            .get("cache-control")
            .unwrap()
            .to_str()
            .unwrap()
    );
    let app_body = axum::body::to_bytes(app_response.into_body(), usize::MAX)
        .await
        .unwrap();
    let app_payload: serde_json::Value = serde_json::from_slice(&app_body).unwrap();
    assert_eq!("/app/v3/api", app_payload["x-api-prefix"]);
    assert!(app_payload["paths"].get("/app/v3/api/ai/models").is_some());

    let backend_response = sdkwork_claw_http::service_router_with_contract_routes(
        "sdkwork-claw-admin-api",
        ApiSurface::Backend,
    )
    .oneshot(
        Request::builder()
            .uri("/backend/v3/api/openapi.json")
            .body(Body::empty())
            .unwrap(),
    )
    .await
    .unwrap();
    assert_eq!(StatusCode::OK, backend_response.status());
    let backend_body = axum::body::to_bytes(backend_response.into_body(), usize::MAX)
        .await
        .unwrap();
    let backend_payload: serde_json::Value = serde_json::from_slice(&backend_body).unwrap();
    assert_eq!("/backend/v3/api", backend_payload["x-api-prefix"]);
    assert!(backend_payload["paths"]
        .get("/backend/v3/api/ai/models")
        .is_some());
}

#[tokio::test]
async fn service_router_health_body_contains_service_identity() {
    let response = sdkwork_claw_http::service_router("sdkwork-claw-admin-api")
        .oneshot(
            Request::builder()
                .uri("/healthz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("ok", payload["status"]);
    assert_eq!("sdkwork-claw-admin-api", payload["service"]);
    assert!(payload["deployment_mode"].is_string());
    assert_eq!(false, payload["database"]["configured"]);
}

#[tokio::test]
async fn service_router_health_body_contains_safe_database_status() {
    let database = DatabaseConfig::from_url_with_max_connections(
        "sqlite://target/test-dbs/health-secret-database.db?mode=rwc",
        8,
    )
    .unwrap();
    let router = sdkwork_claw_http::service_router_with_database_config(
        "sdkwork-claw-admin-api",
        Some(&database),
    );

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/healthz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body).unwrap();

    assert_eq!(true, payload["database"]["configured"]);
    assert_eq!("sqlite", payload["database"]["engine"]);
    assert_eq!(8, payload["database"]["maxConnections"]);
    assert!(!body.contains("sqlite://"));
    assert!(!body.contains("health-secret-database.db"));
    assert!(!body.contains("mode=rwc"));

    let ready = router
        .oneshot(
            Request::builder()
                .uri("/readyz")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let ready_body = axum::body::to_bytes(ready.into_body(), usize::MAX)
        .await
        .unwrap();
    let ready_payload: serde_json::Value = serde_json::from_slice(&ready_body).unwrap();

    assert_eq!(true, ready_payload["database"]["configured"]);
    assert_eq!("sqlite", ready_payload["database"]["engine"]);
    assert_eq!(8, ready_payload["database"]["maxConnections"]);
}

#[test]
fn default_security_headers_are_defined() {
    let headers = sdkwork_claw_http::default_security_headers();

    assert!(headers.contains(&("x-content-type-options", "nosniff")));
    assert!(headers.contains(&("x-frame-options", "DENY")));
    assert!(headers.contains(&("referrer-policy", "no-referrer")));
}
