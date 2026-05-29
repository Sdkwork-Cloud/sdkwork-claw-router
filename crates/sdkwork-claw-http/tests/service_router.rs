use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::DatabaseConfig;
use sdkwork_claw_http::ApiSurface;
use serde_json::Value;
use tower::ServiceExt;

const APP_SDK_AUTHORITY_OPENAPI_JSON: &str =
    include_str!("../../../sdks/clawrouter-app-sdk/openapi/clawrouter-app-sdk.openapi.json");
const BACKEND_SDK_AUTHORITY_OPENAPI_JSON: &str = include_str!(
    "../../../sdks/clawrouter-backend-sdk/openapi/clawrouter-backend-sdk.openapi.json"
);
const OPEN_SDK_AUTHORITY_OPENAPI_JSON: &str =
    include_str!("../../../sdks/clawrouter-open-sdk/openapi/clawrouter-open-sdk.openapi.json");

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
async fn service_router_surface_openapi_documents_include_appbase_commerce_contracts() {
    let app_payload = fetch_surface_openapi(
        "sdkwork-claw-app-api",
        ApiSurface::App,
        "/app/v3/api/openapi.json",
    )
    .await;
    for (method, path, operation_id) in [
        (
            "get",
            "/app/v3/api/catalog/products",
            "catalog.products.list",
        ),
        (
            "get",
            "/app/v3/api/catalog/skus/{skuId}",
            "catalog.skus.retrieve",
        ),
        ("get", "/app/v3/api/cart/current", "cart.current.retrieve"),
        (
            "post",
            "/app/v3/api/checkout/sessions",
            "checkout.sessions.create",
        ),
        ("get", "/app/v3/api/orders/{orderId}", "orders.retrieve"),
        (
            "post",
            "/app/v3/api/payments/intents",
            "payments.intents.create",
        ),
        ("post", "/app/v3/api/refunds", "refunds.create"),
        ("get", "/app/v3/api/fulfillments", "fulfillments.list"),
        (
            "get",
            "/app/v3/api/memberships/current",
            "memberships.current.retrieve",
        ),
        (
            "post",
            "/app/v3/api/memberships/purchases",
            "memberships.purchases.create",
        ),
        (
            "post",
            "/app/v3/api/recharges/orders",
            "recharges.orders.create",
        ),
        ("get", "/app/v3/api/billing/history", "billing.history.list"),
        (
            "get",
            "/app/v3/api/wallet/overview",
            "wallet.overview.retrieve",
        ),
        (
            "get",
            "/app/v3/api/wallet/points/exchanges/rules",
            "wallet.points.exchangeRules.list",
        ),
        ("get", "/app/v3/api/invoices", "invoices.list"),
    ] {
        assert_openapi_operation(&app_payload, method, path, operation_id);
    }
    assert!(
        app_payload["paths"]
            .get("/app/v3/api/wallet/exchanges")
            .is_none(),
        "runtime app OpenAPI must not expose retired duplicate wallet exchanges route"
    );

    let backend_payload = fetch_surface_openapi(
        "sdkwork-claw-admin-api",
        ApiSurface::Backend,
        "/backend/v3/api/openapi.json",
    )
    .await;
    for (method, path, operation_id) in [
        (
            "post",
            "/backend/v3/api/catalog/products",
            "catalog.products.create",
        ),
        (
            "patch",
            "/backend/v3/api/inventory/stocks/{stockId}",
            "inventory.stocks.update",
        ),
        ("get", "/backend/v3/api/orders", "orders.list"),
        (
            "get",
            "/backend/v3/api/payments/providers",
            "payments.providers.list",
        ),
        (
            "post",
            "/backend/v3/api/payments/provider_accounts",
            "payments.providerAccounts.create",
        ),
        (
            "get",
            "/backend/v3/api/payments/route_rules",
            "payments.routeRules.list",
        ),
        ("get", "/backend/v3/api/refunds", "refunds.list"),
        (
            "get",
            "/backend/v3/api/shipments/{shipmentId}/tracking_events",
            "shipments.trackingEvents.list",
        ),
        (
            "post",
            "/backend/v3/api/memberships/plans",
            "memberships.plans.create",
        ),
        (
            "get",
            "/backend/v3/api/wallet/ledger_entries",
            "wallet.ledgerEntries.list",
        ),
        (
            "get",
            "/backend/v3/api/coupons/campaigns",
            "coupons.campaigns.list",
        ),
        (
            "get",
            "/backend/v3/api/commerce_reports/payment_reconciliation",
            "commerceReports.paymentReconciliation.retrieve",
        ),
    ] {
        assert_openapi_operation(&backend_payload, method, path, operation_id);
    }
}

#[tokio::test]
async fn service_router_openapi_documents_match_sdk_authority_contracts() {
    let gateway_payload = fetch_runtime_openapi_json(
        sdkwork_claw_http::service_router("sdkwork-claw-gateway"),
        "/openapi.json",
    )
    .await;
    assert_eq!(
        authority_openapi_json(OPEN_SDK_AUTHORITY_OPENAPI_JSON),
        gateway_payload,
        "runtime gateway /openapi.json must match the Open SDK authority OpenAPI used for SDK generation"
    );

    let app_payload = fetch_runtime_openapi_json(
        sdkwork_claw_http::service_router_with_contract_routes(
            "sdkwork-claw-app-api",
            ApiSurface::App,
        ),
        "/app/v3/api/openapi.json",
    )
    .await;
    assert_eq!(
        authority_openapi_json(APP_SDK_AUTHORITY_OPENAPI_JSON),
        app_payload,
        "runtime app /app/v3/api/openapi.json must match the app SDK authority OpenAPI used for SDK generation"
    );

    let backend_payload = fetch_runtime_openapi_json(
        sdkwork_claw_http::service_router_with_contract_routes(
            "sdkwork-claw-admin-api",
            ApiSurface::Backend,
        ),
        "/backend/v3/api/openapi.json",
    )
    .await;
    assert_eq!(
        authority_openapi_json(BACKEND_SDK_AUTHORITY_OPENAPI_JSON),
        backend_payload,
        "runtime backend /backend/v3/api/openapi.json must match the backend SDK authority OpenAPI used for SDK generation"
    );
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
    let mut database_path = std::env::var_os("CARGO_TARGET_DIR")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(std::env::temp_dir)
        .join("test-dbs");
    std::fs::create_dir_all(&database_path).unwrap();
    database_path.push("health-secret-database.db");
    let database_url = format!(
        "sqlite://{}?mode=rwc",
        database_path.to_string_lossy().replace('\\', "/")
    );
    let database = DatabaseConfig::from_url_with_max_connections(&database_url, 8).unwrap();
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

async fn fetch_surface_openapi(
    service_name: &'static str,
    surface: ApiSurface,
    path: &str,
) -> Value {
    let response = sdkwork_claw_http::service_router_with_contract_routes(service_name, surface)
        .oneshot(Request::builder().uri(path).body(Body::empty()).unwrap())
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

async fn fetch_runtime_openapi_json(router: axum::Router, path: &str) -> Value {
    let response = router
        .oneshot(Request::builder().uri(path).body(Body::empty()).unwrap())
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

fn authority_openapi_json(source: &str) -> Value {
    serde_json::from_str(source).unwrap()
}

fn assert_openapi_operation(payload: &Value, method: &str, path: &str, operation_id: &str) {
    let operation = payload
        .get("paths")
        .and_then(|paths| paths.get(path))
        .and_then(|path_item| path_item.get(method))
        .unwrap_or_else(|| panic!("missing OpenAPI operation {method} {path}"));
    assert_eq!(
        Some(operation_id),
        operation.get("operationId").and_then(Value::as_str),
        "unexpected OpenAPI operationId for {method} {path}"
    );
}
