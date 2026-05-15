use std::sync::Arc;
use std::sync::Mutex;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::ApiKeySecretHasher;
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, DomainResult, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
    ProviderRetryPolicy, RouteCandidate, RoutingCapability, RoutingPolicy, RoutingPolicyScope,
    RoutingRule,
};
use sdkwork_claw_product::infrastructure::crypto::HmacSha256ApiKeySecretHasher;
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;
use sdkwork_claw_product::ports::{ResponsesRelay, ResponsesRelayRequest, ResponsesRelayResponse};
use tower::ServiceExt;

fn catalog_with_hashed_api_key(key_hash: String) -> InMemoryPricingCatalog {
    let mut catalog = InMemoryPricingCatalog::default();
    catalog.add_vendor(ModelVendorDefinition::new(
        "openai",
        ModelVendor::OpenAi,
        "OpenAI",
    ));
    catalog.add_model(
        AiModel::new(
            "gpt-4.1-mini",
            "GPT-4.1 mini",
            "openai",
            vec!["responses", "tools"],
        )
        .with_catalog_key("openai/global/gpt-4.1-mini"),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4.1-mini",
            "gpt-4.1-mini",
            "openrouter",
            3001,
            "openai/global/gpt-4.1-mini",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter"),
            Some("vault://providers/openrouter/account/responses"),
        )
        .with_timeout_ms(30_000)
        .with_retry_policy(ProviderRetryPolicy::new(3, vec![429, 503], 0).unwrap()),
    );
    catalog.add_plan(PricingPlan::new(
        "standard",
        PriceSide::OfficialReference,
        DecimalValue::parse("1.200000").unwrap(),
        Money::usd("0.000000").unwrap(),
    ));
    catalog.add_api_key_group(ApiKeyGroup::new(
        10,
        "standard-group",
        "standard",
        DecimalValue::parse("1.000000").unwrap(),
        DecimalValue::parse("1.100000").unwrap(),
    ));
    catalog.add_api_key(GatewayApiKey::new(101, 10, "sk-live", &key_hash).with_owner(10, 20, 30));
    catalog.add_price(ModelPrice::new_for_catalog_key(
        "openai/global/gpt-4.1-mini",
        "gpt-4.1-mini",
        PriceSide::OfficialReference,
        BillingMeter::LlmInputToken,
        Money::usd("0.150000").unwrap(),
    ));
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4.1-mini",
            "gpt-4.1-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.110000").unwrap(),
        )
        .for_provider("openrouter", 3001),
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-responses-policy",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(9101),
        )
        .with_capability(RoutingCapability::Chat),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            9102,
            10,
            20,
            9101,
            "standard-group-gpt-4-1-mini",
            1,
            r#"{"catalogKey":"openai/global/gpt-4.1-mini"}"#,
            "openai/global/gpt-4.1-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );
    catalog
}

#[tokio::test]
async fn openai_responses_authenticates_validates_price_and_returns_honest_not_implemented() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_responses_router(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/responses")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"model":"gpt-4.1-mini","input":"hello"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_IMPLEMENTED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body).unwrap();

    assert_eq!("responses_relay_not_configured", payload["error"]["code"]);
    assert_eq!("server_error", payload["error"]["type"]);
    assert!(!body.contains("sk-live-secret"));
}

#[tokio::test]
async fn openai_responses_rejects_unknown_model_after_authentication() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_responses_router(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/responses")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"missing-responses","input":"hello"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("model_not_found", payload["error"]["code"]);
}

#[derive(Debug)]
struct RecordingResponsesRelay {
    captured: Arc<Mutex<Vec<ResponsesRelayRequest>>>,
}

impl RecordingResponsesRelay {
    fn new(captured: Arc<Mutex<Vec<ResponsesRelayRequest>>>) -> Self {
        Self { captured }
    }
}

impl ResponsesRelay for RecordingResponsesRelay {
    fn create_response<'a>(
        &'a self,
        request: ResponsesRelayRequest,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = DomainResult<ResponsesRelayResponse>> + Send + 'a>,
    > {
        self.captured.lock().unwrap().push(request);
        Box::pin(async {
            Ok(ResponsesRelayResponse::json(
                200,
                serde_json::json!({
                    "id": "resp-test",
                    "object": "response",
                    "model": "gpt-4.1-mini",
                    "output": [
                        {
                            "type": "message",
                            "role": "assistant",
                            "content": [{"type": "output_text", "text": "pong"}]
                        }
                    ],
                    "usage": {"input_tokens": 1, "output_tokens": 1, "total_tokens": 2}
                }),
            ))
        })
    }
}

#[tokio::test]
async fn openai_responses_relays_non_stream_request_after_auth_model_and_price_validation() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingResponsesRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_responses_router_with_relay(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/responses")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"model":"gpt-4.1-mini","input":"hello"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("resp-test", payload["id"]);
    assert_eq!("pong", payload["output"][0]["content"][0]["text"]);

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(101, captured[0].api_key_id);
    assert_eq!(10, captured[0].group_id);
    assert_eq!("standard-group", captured[0].group_code);
    assert_eq!("standard", captured[0].pricing_plan_code);
    assert_eq!("gpt-4.1-mini", captured[0].model);
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!("openai/global/gpt-4.1-mini", captured[0].provider_model);
    assert_eq!(
        Some("http://provider-proxy.internal/openrouter"),
        captured[0].provider_base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/responses"),
        captured[0].provider_secret_ref.as_deref()
    );
    assert_eq!(Some(30_000), captured[0].provider_timeout_ms);
    assert_eq!(
        Some(ProviderRetryPolicy::new(3, vec![429, 503], 0).unwrap()),
        captured[0].provider_retry_policy
    );
    assert_eq!("hello", captured[0].request_body["input"]);
}

#[tokio::test]
async fn openai_responses_rejects_chat_only_model_before_fake_success() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key(key_hash);
    catalog.add_model(
        AiModel::new("gpt-4o-mini", "GPT-4o mini", "openai", vec!["chat"])
            .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new(
            "gpt-4o-mini",
            "openrouter",
            3002,
            "openai/global/gpt-4o-mini",
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::LlmInputToken,
            Money::usd("0.150000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    let router = sdkwork_claw_product::api::openai_responses_router(Arc::new(catalog), hasher);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/responses")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"model":"gpt-4o-mini","input":"hello"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("model_capability_not_supported", payload["error"]["code"]);
}

#[tokio::test]
async fn openai_responses_rejects_streaming_before_fake_chunks() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_responses_router(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/responses")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4.1-mini","input":"hello","stream":true}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_IMPLEMENTED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("streaming_relay_not_configured", payload["error"]["code"]);
}
