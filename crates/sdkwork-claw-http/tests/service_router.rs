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
    assert_eq!(5, payload["tabs"].as_array().unwrap().len());
    assert_eq!("gateway", payload["tabs"][0]["id"]);
    assert_eq!("AI聚合API", payload["tabs"][0]["name"]);
    assert_eq!("available", payload["tabs"][0]["status"]);
    assert_eq!(10, payload["tabs"][0]["order"]);
    assert_eq!("/openapi.json", payload["tabs"][0]["defaultSchemaUrl"]);
    assert_eq!("/openapi.json", payload["tabs"][0]["schemaUrls"][0]);
    assert_eq!("payment-aggregate", payload["tabs"][1]["id"]);
    assert_eq!("支付聚合API", payload["tabs"][1]["name"]);
    assert_eq!("available", payload["tabs"][1]["status"]);
    assert_eq!(20, payload["tabs"][1]["order"]);
    assert_eq!(
        "/payments/v3/openapi.json",
        payload["tabs"][1]["defaultSchemaUrl"]
    );
    assert_eq!(
        "/payments/v3/openapi.json",
        payload["tabs"][1]["schemaUrls"][0]
    );
    assert_eq!("cloud-services", payload["tabs"][2]["id"]);
    assert_eq!("基础云服务API", payload["tabs"][2]["name"]);
    assert_eq!("planned", payload["tabs"][2]["status"]);
    assert_eq!(30, payload["tabs"][2]["order"]);
    assert!(payload["tabs"][2]["schemaUrls"]
        .as_array()
        .unwrap()
        .is_empty());
    assert!(payload["tabs"][2].get("defaultSchemaUrl").is_none());
    assert_eq!("app", payload["tabs"][3]["id"]);
    assert_eq!(40, payload["tabs"][3]["order"]);
    assert_eq!(
        "/app/v3/api/openapi.json",
        payload["tabs"][3]["schemaUrls"][0]
    );
    assert_eq!("backend", payload["tabs"][4]["id"]);
    assert_eq!(50, payload["tabs"][4]["order"]);
    assert_eq!(
        "/backend/v3/api/openapi.json",
        payload["tabs"][4]["schemaUrls"][0]
    );
}

#[tokio::test]
async fn service_router_exposes_payment_aggregate_openapi_document() {
    let response = sdkwork_claw_http::service_router("sdkwork-claw-gateway")
        .oneshot(
            Request::builder()
                .uri("/payments/v3/openapi.json")
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
    assert_eq!("3.1.2", payload["openapi"]);
    assert_eq!("SDKWork Payment Aggregate API", payload["info"]["title"]);
    assert_eq!("/payments/v3", payload["x-api-prefix"]);
    assert!(payload["paths"]
        .get("/payments/v3/payment_intents")
        .is_some());
    assert!(payload["paths"].get("/payments/v3/refunds").is_some());
    assert!(payload["paths"]
        .get("/payments/v3/reconciliation/statements")
        .is_some());
    assert!(payload["paths"]
        .get("/payments/v3/native_operations")
        .is_some());
    assert!(payload["components"]["schemas"]["PaymentProviderCode"]
        ["x-sdkwork-initial-provider-codes"]
        .as_array()
        .unwrap()
        .iter()
        .any(|value| value == "wechat_pay"));
    assert!(payload["components"]["schemas"]["PaymentProviderCode"]
        ["x-sdkwork-initial-provider-codes"]
        .as_array()
        .unwrap()
        .iter()
        .any(|value| value == "stripe"));
}

#[tokio::test]
async fn service_router_payment_aggregate_openapi_contract_defines_standard_payment_surface() {
    let payload = fetch_runtime_openapi_json(
        sdkwork_claw_http::service_router("sdkwork-claw-gateway"),
        "/payments/v3/openapi.json",
    )
    .await;

    assert_eq!("definition-only", payload["x-sdkwork-contract-state"]);
    assert_eq!("payment-aggregate", payload["x-sdkwork-sdk-family"]);

    for provider_code in [
        "wechat_pay",
        "alipay",
        "stripe",
        "paypal",
        "apple_pay",
        "google_pay",
    ] {
        assert_json_array_contains(
            &payload["components"]["schemas"]["PaymentProviderCode"]
                ["x-sdkwork-initial-provider-codes"],
            provider_code,
        );
        assert_json_array_contains(&payload["x-supported-provider-codes"], provider_code);
    }
    for provider_code in [
        "yeepay",
        "unionpay",
        "jd_pay",
        "lianlian_pay",
        "lakala",
        "allinpay",
        "china_ums",
        "fuiou_pay",
        "sandpay",
        "huifu_pay",
        "baofoo",
        "bill99",
        "pingan_pay",
        "icbc_pay",
        "cmb_pay",
        "ccb_pay",
        "boc_pay",
        "psbc_pay",
    ] {
        assert_json_array_contains(
            &payload["components"]["schemas"]["PaymentProviderCode"]
                ["x-sdkwork-extension-provider-codes"],
            provider_code,
        );
        assert_json_array_contains(&payload["x-extension-provider-codes"], provider_code);
    }
    for provider_option in [
        "wechatPay",
        "alipay",
        "stripe",
        "paypal",
        "applePay",
        "googlePay",
        "extension",
    ] {
        assert_eq!(
            "#/components/schemas/ProviderNativeOptions",
            payload["components"]["schemas"]["PaymentProviderOptions"]["properties"]
                [provider_option]["$ref"],
            "PaymentProviderOptions must expose provider-native options for {provider_option}"
        );
    }

    for capability in [
        "payment_intent_create",
        "payment_intent_confirm",
        "payment_intent_capture",
        "payment_intent_cancel",
        "refund_create",
        "refund_cancel",
        "statement_download",
        "reconciliation_task",
        "webhook_verify",
        "webhook_event_ingest",
        "native_operation",
    ] {
        assert_json_array_contains(
            &payload["components"]["schemas"]["PaymentCapabilityCode"]["enum"],
            capability,
        );
    }

    assert_eq!(
        "#/components/schemas/PaymentRefundItemCreateRequest",
        payload["components"]["schemas"]["PaymentRefundCreateRequest"]["properties"]["items"]
            ["items"]["$ref"]
    );
    assert_eq!(
        "#/components/schemas/PaymentRefundItem",
        payload["components"]["schemas"]["PaymentRefund"]["properties"]["items"]["items"]["$ref"]
    );
    assert_json_array_contains(
        &payload["components"]["schemas"]["PaymentRefund"]["required"],
        "items",
    );

    for (method, path, operation_id, result_schema) in [
        (
            "get",
            "/payments/v3/providers",
            "paymentProviders.list",
            "PaymentProviderListResult",
        ),
        (
            "get",
            "/payments/v3/providers/{providerCode}/capabilities",
            "paymentProviders.capabilities.retrieve",
            "PaymentProviderCapabilitiesResult",
        ),
        (
            "get",
            "/payments/v3/payment_methods",
            "paymentMethods.list",
            "PaymentMethodListResult",
        ),
        (
            "get",
            "/payments/v3/payment_intents",
            "paymentIntents.list",
            "PaymentIntentListResult",
        ),
        (
            "post",
            "/payments/v3/payment_intents",
            "paymentIntents.create",
            "PaymentIntentResult",
        ),
        (
            "get",
            "/payments/v3/payment_intents/{paymentIntentId}",
            "paymentIntents.retrieve",
            "PaymentIntentResult",
        ),
        (
            "post",
            "/payments/v3/payment_intents/{paymentIntentId}/confirm",
            "paymentIntents.confirm",
            "PaymentIntentResult",
        ),
        (
            "post",
            "/payments/v3/payment_intents/{paymentIntentId}/capture",
            "paymentIntents.capture",
            "PaymentIntentResult",
        ),
        (
            "post",
            "/payments/v3/payment_intents/{paymentIntentId}/cancel",
            "paymentIntents.cancel",
            "PaymentIntentResult",
        ),
        (
            "get",
            "/payments/v3/refunds",
            "paymentRefunds.list",
            "PaymentRefundListResult",
        ),
        (
            "post",
            "/payments/v3/refunds",
            "paymentRefunds.create",
            "PaymentRefundResult",
        ),
        (
            "get",
            "/payments/v3/refunds/{refundId}",
            "paymentRefunds.retrieve",
            "PaymentRefundResult",
        ),
        (
            "post",
            "/payments/v3/refunds/{refundId}/cancel",
            "paymentRefunds.cancel",
            "PaymentRefundResult",
        ),
        (
            "get",
            "/payments/v3/reconciliation/statements",
            "paymentReconciliationStatements.list",
            "ReconciliationStatementListResult",
        ),
        (
            "get",
            "/payments/v3/reconciliation/statements/{statementId}",
            "paymentReconciliationStatements.retrieve",
            "ReconciliationStatementResult",
        ),
        (
            "post",
            "/payments/v3/reconciliation/statements/downloads",
            "paymentReconciliationStatementDownloads.create",
            "ReconciliationStatementDownloadResult",
        ),
        (
            "post",
            "/payments/v3/reconciliation/tasks",
            "paymentReconciliationTasks.create",
            "ReconciliationTaskResult",
        ),
        (
            "get",
            "/payments/v3/reconciliation/tasks/{taskId}",
            "paymentReconciliationTasks.retrieve",
            "ReconciliationTaskResult",
        ),
        (
            "get",
            "/payments/v3/reconciliation/tasks/{taskId}/differences",
            "paymentReconciliationTasks.differences.list",
            "ReconciliationDifferenceListResult",
        ),
        (
            "post",
            "/payments/v3/webhooks/{providerCode}/verify",
            "paymentWebhooks.verify",
            "WebhookVerifyResult",
        ),
        (
            "post",
            "/payments/v3/webhooks/{providerCode}/events",
            "paymentWebhooks.events.create",
            "WebhookEventResult",
        ),
        (
            "get",
            "/payments/v3/webhook_events",
            "paymentWebhookEvents.list",
            "WebhookEventListResult",
        ),
        (
            "post",
            "/payments/v3/webhook_events/{eventId}/replay",
            "paymentWebhookEvents.replay",
            "WebhookReplayResult",
        ),
        (
            "post",
            "/payments/v3/native_operations",
            "paymentNativeOperations.invoke",
            "NativeOperationResult",
        ),
    ] {
        let operation = assert_openapi_operation(&payload, method, path, operation_id);
        assert_eq!(
            Some(true),
            operation
                .get("x-sdkwork-definition-only")
                .and_then(Value::as_bool),
            "payment aggregate operation must be marked definition-only for {method} {path}"
        );
        assert!(
            operation.get("summary").and_then(Value::as_str).is_some(),
            "missing summary for {method} {path}"
        );
        assert!(
            operation
                .get("description")
                .and_then(Value::as_str)
                .is_some(),
            "missing description for {method} {path}"
        );
        assert_eq!(
            Some(format!("#/components/schemas/{result_schema}")),
            operation["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
                .as_str()
                .map(str::to_owned),
            "200 JSON response must use the expected SDKWORK result envelope for {method} {path}"
        );
        assert!(
            operation["responses"]["default"]["$ref"]
                .as_str()
                .is_some_and(|response_ref| response_ref == "#/components/responses/PaymentError"),
            "default response must use PaymentError for {method} {path}"
        );
    }

    let webhook_ingest = assert_openapi_operation(
        &payload,
        "post",
        "/payments/v3/webhooks/{providerCode}/events",
        "paymentWebhooks.events.create",
    );
    assert!(
        !operation_references_parameter(
            webhook_ingest,
            "#/components/parameters/IdempotencyKeyHeader"
        ),
        "provider webhook ingestion must not require SDKWORK Idempotency-Key because native providers do not consistently send it"
    );
    assert!(
        operation_references_parameter(
            webhook_ingest,
            "#/components/parameters/ProviderWebhookDeliveryIdHeader"
        ),
        "provider webhook ingestion should accept an optional provider delivery id header"
    );
    assert_eq!(
        Some(false),
        payload["components"]["parameters"]["ProviderWebhookDeliveryIdHeader"]["required"]
            .as_bool(),
        "provider webhook delivery id header must be optional"
    );
    assert_eq!(
        Some(true),
        payload["components"]["schemas"]["NativeOperationResponse"]["properties"]["payload"]
            ["additionalProperties"]
            .as_bool(),
        "native operation responses must expose the provider-native payload for unsupported channel capabilities"
    );
    for (method, path, operation_id, response_schema) in [
        (
            "get",
            "/payments/v3/payment_intents",
            "paymentIntents.list",
            "PaymentIntentListResponse",
        ),
        (
            "get",
            "/payments/v3/refunds",
            "paymentRefunds.list",
            "PaymentRefundListResponse",
        ),
        (
            "get",
            "/payments/v3/reconciliation/statements",
            "paymentReconciliationStatements.list",
            "ReconciliationStatementListResponse",
        ),
        (
            "get",
            "/payments/v3/reconciliation/tasks/{taskId}/differences",
            "paymentReconciliationTasks.differences.list",
            "ReconciliationDifferenceListResponse",
        ),
        (
            "get",
            "/payments/v3/webhook_events",
            "paymentWebhookEvents.list",
            "WebhookEventListResponse",
        ),
    ] {
        let operation = assert_openapi_operation(&payload, method, path, operation_id);
        assert!(
            operation_has_parameter(operation, "page"),
            "{operation_id} must expose a page query parameter"
        );
        assert!(
            operation_has_parameter(operation, "pageSize"),
            "{operation_id} must expose a pageSize query parameter"
        );
        assert_eq!(
            "#/components/schemas/PageInfo",
            payload["components"]["schemas"][response_schema]["properties"]["pageInfo"]["$ref"],
            "{response_schema} must include standard pageInfo"
        );
    }
    for (method, path, operation_id) in [
        ("get", "/payments/v3/payment_intents", "paymentIntents.list"),
        ("get", "/payments/v3/refunds", "paymentRefunds.list"),
        (
            "get",
            "/payments/v3/webhook_events",
            "paymentWebhookEvents.list",
        ),
    ] {
        let operation = assert_openapi_operation(&payload, method, path, operation_id);
        assert!(
            operation_has_parameter(operation, "createdFrom"),
            "{operation_id} must expose a createdFrom query parameter for SDK sync and reconciliation windows"
        );
        assert!(
            operation_has_parameter(operation, "createdTo"),
            "{operation_id} must expose a createdTo query parameter for SDK sync and reconciliation windows"
        );
    }
    for schema_name in [
        "PaymentIntent",
        "PaymentRefund",
        "ReconciliationStatement",
        "ReconciliationTask",
        "ReconciliationDifference",
        "WebhookEvent",
    ] {
        assert_schema_requires_property(&payload, schema_name, "createdAt");
        assert_schema_requires_property(&payload, schema_name, "updatedAt");
    }
    assert_schema_requires_property(&payload, "WebhookEventResponse", "verified");
    assert_schema_requires_property(&payload, "NativeOperationResponse", "payload");

    let result_schemas = payload["components"]["schemas"]
        .as_object()
        .unwrap()
        .iter()
        .filter(|(name, _)| name.ends_with("Result") && name.as_str() != "PaymentErrorResult");
    for (schema_name, schema) in result_schemas {
        assert_eq!(
            "#/components/schemas/PaymentResultBase", schema["allOf"][0]["$ref"],
            "{schema_name} must include PaymentResultBase"
        );
        assert!(
            schema["allOf"].as_array().unwrap().iter().all(|item| item
                .get("additionalProperties")
                .is_none()),
            "{schema_name} allOf branches must not use additionalProperties:false because it blocks the composed SDKWORK envelope"
        );
        let has_required_data = schema["allOf"].as_array().unwrap().iter().any(|item| {
            item["required"]
                .as_array()
                .is_some_and(|required| required.iter().any(|value| value == "data"))
                && item["properties"]["data"].is_object()
        });
        assert!(
            has_required_data,
            "{schema_name} must include a required data payload"
        );
    }
    assert!(
        payload["components"]["schemas"]["PaymentResultBase"]
            .get("additionalProperties")
            .is_none(),
        "PaymentResultBase must stay composable with concrete data envelopes"
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

    let app_payment_response = sdkwork_claw_http::service_router_with_contract_routes(
        "sdkwork-claw-app-api",
        ApiSurface::App,
    )
    .oneshot(
        Request::builder()
            .uri("/payments/v3/openapi.json")
            .body(Body::empty())
            .unwrap(),
    )
    .await
    .unwrap();
    assert_eq!(StatusCode::NOT_FOUND, app_payment_response.status());

    let backend_payment_response = sdkwork_claw_http::service_router_with_contract_routes(
        "sdkwork-claw-admin-api",
        ApiSurface::Backend,
    )
    .oneshot(
        Request::builder()
            .uri("/payments/v3/openapi.json")
            .body(Body::empty())
            .unwrap(),
    )
    .await
    .unwrap();
    assert_eq!(StatusCode::NOT_FOUND, backend_payment_response.status());
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
            "/backend/v3/api/promotions/offers",
            "promotions.offers.management.list",
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

fn assert_openapi_operation<'a>(
    payload: &'a Value,
    method: &str,
    path: &str,
    operation_id: &str,
) -> &'a Value {
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
    operation
}

fn assert_json_array_contains(values: &Value, expected: &str) {
    assert!(
        values
            .as_array()
            .unwrap_or_else(|| panic!("expected JSON array containing {expected}"))
            .iter()
            .any(|value| value == expected),
        "expected JSON array to contain {expected}"
    );
}

fn operation_references_parameter(operation: &Value, parameter_ref: &str) -> bool {
    operation["parameters"]
        .as_array()
        .is_some_and(|parameters| {
            parameters
                .iter()
                .any(|parameter| parameter["$ref"] == parameter_ref)
        })
}

fn operation_has_parameter(operation: &Value, expected_name: &str) -> bool {
    operation["parameters"]
        .as_array()
        .is_some_and(|parameters| {
            parameters
                .iter()
                .any(|parameter| parameter["name"] == expected_name)
        })
}

fn assert_schema_requires_property(payload: &Value, schema_name: &str, property_name: &str) {
    assert!(
        payload["components"]["schemas"][schema_name]["required"]
            .as_array()
            .is_some_and(|required| required.iter().any(|value| value == property_name)),
        "{schema_name} must require {property_name}"
    );
    assert!(
        payload["components"]["schemas"][schema_name]["properties"][property_name].is_object(),
        "{schema_name} must define {property_name}"
    );
}
