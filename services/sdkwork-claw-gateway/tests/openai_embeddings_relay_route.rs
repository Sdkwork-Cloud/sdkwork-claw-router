use std::sync::Arc;
use std::sync::Mutex;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::ApiKeySecretHasher;
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, DomainResult, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
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
    catalog.add_model(AiModel::new(
        "text-embedding-3-small",
        "Text Embedding 3 Small",
        "openai",
        vec!["embedding"],
    ));
    catalog.add_provider_route(ModelProviderRoute::new_for_catalog_key(
        "openai/global/text-embedding-3-small",
        "text-embedding-3-small",
        "openrouter",
        3001,
        "openai/global/text-embedding-3-small",
    ));
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

#[derive(Debug)]
struct GatewayRecordingEmbeddingsRelay {
    captured: Arc<Mutex<Vec<EmbeddingsRelayRequest>>>,
}

impl GatewayRecordingEmbeddingsRelay {
    fn new(captured: Arc<Mutex<Vec<EmbeddingsRelayRequest>>>) -> Self {
        Self { captured }
    }
}

impl EmbeddingsRelay for GatewayRecordingEmbeddingsRelay {
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
                        {"object": "embedding", "index": 0, "embedding": [0.1, 0.2, 0.3]}
                    ],
                    "usage": {"prompt_tokens": 1, "total_tokens": 1}
                }),
            ))
        })
    }
}

#[tokio::test]
async fn gateway_can_mount_non_stream_embeddings_relay() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(GatewayRecordingEmbeddingsRelay::new(Arc::clone(&captured)));
    let router =
        sdkwork_claw_gateway::router_with_product_catalog_api_key_hasher_and_embeddings_relay(
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
                    r#"{"model":"text-embedding-3-small","input":["ping"]}"#,
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
    assert_eq!(0.3, payload["data"][0]["embedding"][2]);
    assert_eq!("openrouter", captured.lock().unwrap()[0].provider_code);
}
