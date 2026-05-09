use std::sync::Arc;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::ApiKeySecretHasher;
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, DomainResult, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
    ProviderRetryPolicy,
};
use sdkwork_claw_product::infrastructure::crypto::HmacSha256ApiKeySecretHasher;
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;
use sdkwork_claw_product::ports::{
    EmbeddingsRelay, EmbeddingsRelayRequest, EmbeddingsRelayResponse,
};
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
            "text-embedding-3-small",
            "Text Embedding 3 Small",
            "openai",
            vec!["embedding"],
        )
        .with_catalog_key("openai/global/text-embedding-3-small"),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/text-embedding-3-small",
            "text-embedding-3-small",
            "openrouter",
            3001,
            "openai/global/text-embedding-3-small",
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
    catalog.add_api_key(GatewayApiKey::new(101, 10, "sk-live", &key_hash));
    catalog.add_price(ModelPrice::new_for_catalog_key(
        "openai/global/text-embedding-3-small",
        "text-embedding-3-small",
        PriceSide::OfficialReference,
        BillingMeter::EmbeddingInputToken,
        Money::usd("0.020000").unwrap(),
    ));
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/text-embedding-3-small",
            "text-embedding-3-small",
            PriceSide::UpstreamCost,
            BillingMeter::EmbeddingInputToken,
            Money::usd("0.010000").unwrap(),
        )
        .for_provider("openrouter", 3001),
    );
    catalog
}

#[tokio::test]
async fn openai_embeddings_authenticates_validates_price_and_returns_honest_not_implemented() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_embeddings_router(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/embeddings")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"text-embedding-3-small","input":"hello"}"#,
                ))
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

    assert_eq!("embedding_relay_not_configured", payload["error"]["code"]);
    assert_eq!("server_error", payload["error"]["type"]);
    assert!(!body.contains("sk-live-secret"));
}

#[tokio::test]
async fn openai_embeddings_rejects_unknown_model_after_authentication() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_embeddings_router(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/embeddings")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"missing-embedding","input":"hello"}"#,
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
struct RecordingEmbeddingsRelay {
    captured: Arc<std::sync::Mutex<Vec<EmbeddingsRelayRequest>>>,
}

impl RecordingEmbeddingsRelay {
    fn new(captured: Arc<std::sync::Mutex<Vec<EmbeddingsRelayRequest>>>) -> Self {
        Self { captured }
    }
}

impl EmbeddingsRelay for RecordingEmbeddingsRelay {
    fn create_embedding<'a>(
        &'a self,
        request: EmbeddingsRelayRequest,
    ) -> std::pin::Pin<
        Box<dyn std::future::Future<Output = DomainResult<EmbeddingsRelayResponse>> + Send + 'a>,
    > {
        self.captured.lock().unwrap().push(request);
        Box::pin(async {
            Ok(EmbeddingsRelayResponse::json(
                200,
                serde_json::json!({
                    "object": "list",
                    "model": "openai/global/text-embedding-3-small",
                    "data": [
                        {
                            "object": "embedding",
                            "index": 0,
                            "embedding": [0.1, 0.2, 0.3]
                        }
                    ],
                    "usage": {"prompt_tokens": 1, "total_tokens": 1}
                }),
            ))
        })
    }
}

#[tokio::test]
async fn openai_embeddings_relays_request_after_auth_model_and_price_validation() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(std::sync::Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingEmbeddingsRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_embeddings_router_with_relay(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/embeddings")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"text-embedding-3-small","input":["hello"],"encoding_format":"float"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("list", payload["object"]);
    assert_eq!(0.2, payload["data"][0]["embedding"][1]);

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(101, captured[0].api_key_id);
    assert_eq!(10, captured[0].group_id);
    assert_eq!("standard-group", captured[0].group_code);
    assert_eq!("standard", captured[0].pricing_plan_code);
    assert_eq!("text-embedding-3-small", captured[0].model);
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!(
        "openai/global/text-embedding-3-small",
        captured[0].provider_model
    );
    assert_eq!(Some(30_000), captured[0].provider_timeout_ms);
    assert_eq!(
        Some(ProviderRetryPolicy::new(3, vec![429, 503], 0).unwrap()),
        captured[0].provider_retry_policy
    );
    assert_eq!(
        "hello",
        captured[0].request_body["input"].as_array().unwrap()[0]
    );
}

#[tokio::test]
async fn openai_embeddings_rejects_chat_only_model_before_fake_success() {
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
            BillingMeter::EmbeddingInputToken,
            Money::usd("0.020000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    let router = sdkwork_claw_product::api::openai_embeddings_router(Arc::new(catalog), hasher);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/embeddings")
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
