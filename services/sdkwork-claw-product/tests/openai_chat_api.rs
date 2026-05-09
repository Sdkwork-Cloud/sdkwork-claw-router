use std::sync::Arc;
use std::sync::Mutex;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::ApiKeySecretHasher;
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
    ProviderRetryPolicy,
};
use sdkwork_claw_product::infrastructure::crypto::HmacSha256ApiKeySecretHasher;
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;
use sdkwork_claw_product::ports::{
    ChatCompletionRelay, ChatCompletionRelayRequest, ChatCompletionRelayResponse,
    ChatCompletionStreamRelay, ChatCompletionStreamRelayResponse, GatewayUsageRecordCommand,
    GatewayUsageRecorder,
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
        "gpt-4o-mini",
        "GPT-4o mini",
        "openai",
        vec!["chat", "tools"],
    ));
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter",
            3001,
            "openai/global/gpt-4o-mini",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter"),
            Some("vault://providers/openrouter/account/main"),
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
        "openai/global/gpt-4o-mini",
        "gpt-4o-mini",
        PriceSide::OfficialReference,
        BillingMeter::LlmInputToken,
        Money::usd("0.150000").unwrap(),
    ));
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.110000").unwrap(),
        )
        .for_provider("openrouter", 3001),
    );
    catalog.add_price(ModelPrice::new_for_catalog_key(
        "openai/global/gpt-4o-mini",
        "gpt-4o-mini",
        PriceSide::OfficialReference,
        BillingMeter::LlmOutputToken,
        Money::usd("0.600000").unwrap(),
    ));
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmOutputToken,
            Money::usd("0.440000").unwrap(),
        )
        .for_provider("openrouter", 3001),
    );
    catalog
}

fn catalog_with_regional_minimax_models(key_hash: String) -> InMemoryPricingCatalog {
    let mut catalog = InMemoryPricingCatalog::default();
    catalog.add_vendor(ModelVendorDefinition::new(
        "minimax",
        ModelVendor::MiniMax,
        "MiniMax China",
    ));
    catalog.add_vendor(ModelVendorDefinition::new(
        "minimax",
        ModelVendor::MiniMax,
        "MiniMax Global",
    ));
    catalog.add_model(
        AiModel::new(
            "MiniMax-M2.7",
            "MiniMax M2.7",
            "minimax",
            vec!["chat", "tools"],
        )
        .with_catalog_key("minimax/cn/MiniMax-M2.7"),
    );
    catalog.add_model(
        AiModel::new(
            "MiniMax-M2.7",
            "MiniMax M2.7",
            "minimax",
            vec!["chat", "tools"],
        )
        .with_catalog_key("minimax/global/MiniMax-M2.7"),
    );
    catalog.add_provider_route(ModelProviderRoute::new_for_catalog_key(
        "minimax/cn/MiniMax-M2.7",
        "MiniMax-M2.7",
        "minimax_direct",
        4001,
        "MiniMax-M2.7",
    ));
    catalog.add_plan(PricingPlan::new(
        "standard",
        PriceSide::OfficialReference,
        DecimalValue::parse("1.000000").unwrap(),
        Money::cny("0.000000").unwrap(),
    ));
    catalog.add_api_key_group(ApiKeyGroup::new(
        10,
        "standard-group",
        "standard",
        DecimalValue::parse("1.000000").unwrap(),
        DecimalValue::parse("1.000000").unwrap(),
    ));
    catalog.add_api_key(GatewayApiKey::new(101, 10, "sk-live", &key_hash).with_owner(10, 20, 30));
    catalog.add_price(ModelPrice::new_for_catalog_key(
        "minimax/cn/MiniMax-M2.7",
        "MiniMax-M2.7",
        PriceSide::OfficialReference,
        BillingMeter::LlmInputToken,
        Money::cny("0.004000").unwrap(),
    ));
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "minimax/cn/MiniMax-M2.7",
            "MiniMax-M2.7",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::cny("0.004000").unwrap(),
        )
        .for_provider("minimax_direct", 4001),
    );
    catalog
}

#[tokio::test]
async fn openai_chat_completions_authenticates_and_returns_honest_relay_not_implemented() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_chat_completions_router(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
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

    assert_eq!("provider_relay_not_configured", payload["error"]["code"]);
    assert_eq!("server_error", payload["error"]["type"]);
    assert!(!body.contains("sk-live-secret"));
}

#[tokio::test]
async fn openai_chat_completions_rejects_unknown_model_after_authentication() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_chat_completions_router(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"missing-model","messages":[{"role":"user","content":"ping"}]}"#,
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

#[tokio::test]
async fn openai_chat_completions_rejects_ambiguous_official_model_id_when_multiple_vendors_match() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_chat_completions_router(
        Arc::new(catalog_with_regional_minimax_models(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"MiniMax-M2.7","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("ambiguous_model", payload["error"]["code"]);
    assert!(payload["error"]["message"]
        .as_str()
        .unwrap()
        .contains("minimax/cn/MiniMax-M2.7"));
    assert!(payload["error"]["message"]
        .as_str()
        .unwrap()
        .contains("minimax/global/MiniMax-M2.7"));
}

#[tokio::test]
async fn openai_chat_completions_accepts_catalog_key_for_regional_model_identity() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_chat_completions_router(
        Arc::new(catalog_with_regional_minimax_models(key_hash)),
        hasher,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"minimax/cn/MiniMax-M2.7","messages":[{"role":"user","content":"ping"}]}"#,
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

    assert_eq!("provider_relay_not_configured", payload["error"]["code"]);
}

#[derive(Debug)]
struct RecordingRelay {
    captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
}

impl RecordingRelay {
    fn new(captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>) -> Self {
        Self { captured }
    }
}

impl ChatCompletionRelay for RecordingRelay {
    fn create_chat_completion<'a>(
        &'a self,
        request: ChatCompletionRelayRequest,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = sdkwork_claw_product::domain::DomainResult<
                        ChatCompletionRelayResponse,
                    >,
                > + Send
                + 'a,
        >,
    > {
        self.captured.lock().unwrap().push(request);
        Box::pin(async {
            Ok(ChatCompletionRelayResponse::json(
                200,
                serde_json::json!({
                    "id": "chatcmpl-test",
                    "object": "chat.completion",
                    "model": "gpt-4o-mini",
                    "choices": [
                        {
                            "index": 0,
                            "message": {"role": "assistant", "content": "pong"},
                            "finish_reason": "stop"
                        }
                    ],
                    "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2}
                }),
            ))
        })
    }
}

#[derive(Debug)]
struct RecordingStreamRelay {
    captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
    body: &'static str,
}

impl RecordingStreamRelay {
    fn new(captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>) -> Self {
        Self {
            captured,
            body: "data: {\"id\":\"chatcmpl-stream\",\"choices\":[{\"delta\":{\"content\":\"pong\"}}]}\n\ndata: {\"id\":\"chatcmpl-stream\",\"choices\":[],\"usage\":{\"prompt_tokens\":1,\"completion_tokens\":1,\"total_tokens\":2}}\n\ndata: [DONE]\n\n",
        }
    }

    fn with_body(
        captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
        body: &'static str,
    ) -> Self {
        Self { captured, body }
    }
}

impl ChatCompletionStreamRelay for RecordingStreamRelay {
    fn create_chat_completion_stream<'a>(
        &'a self,
        request: ChatCompletionRelayRequest,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = sdkwork_claw_product::domain::DomainResult<
                        ChatCompletionStreamRelayResponse,
                    >,
                > + Send
                + 'a,
        >,
    > {
        self.captured.lock().unwrap().push(request);
        Box::pin(async {
            Ok(ChatCompletionStreamRelayResponse::new(
                200,
                Some("text/event-stream".to_owned()),
                axum::body::Body::from(self.body),
            ))
        })
    }
}

#[derive(Debug)]
struct MissingUsageRelay;

impl ChatCompletionRelay for MissingUsageRelay {
    fn create_chat_completion<'a>(
        &'a self,
        _request: ChatCompletionRelayRequest,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<
                    Output = sdkwork_claw_product::domain::DomainResult<
                        ChatCompletionRelayResponse,
                    >,
                > + Send
                + 'a,
        >,
    > {
        Box::pin(async {
            Ok(ChatCompletionRelayResponse::json(
                200,
                serde_json::json!({
                    "id": "chatcmpl-missing-usage",
                    "object": "chat.completion",
                    "model": "gpt-4o-mini",
                    "choices": [
                        {
                            "index": 0,
                            "message": {"role": "assistant", "content": "pong"},
                            "finish_reason": "stop"
                        }
                    ]
                }),
            ))
        })
    }
}

#[derive(Debug)]
struct RecordingUsageRecorder {
    captured: Arc<Mutex<Vec<GatewayUsageRecordCommand>>>,
}

impl RecordingUsageRecorder {
    fn new(captured: Arc<Mutex<Vec<GatewayUsageRecordCommand>>>) -> Self {
        Self { captured }
    }
}

impl GatewayUsageRecorder for RecordingUsageRecorder {
    fn record_gateway_usage<'a>(
        &'a self,
        command: GatewayUsageRecordCommand,
    ) -> std::pin::Pin<
        Box<
            dyn std::future::Future<Output = sdkwork_claw_product::domain::DomainResult<()>>
                + Send
                + 'a,
        >,
    > {
        self.captured.lock().unwrap().push(command);
        Box::pin(async { Ok(()) })
    }
}

#[tokio::test]
async fn openai_chat_completions_relays_non_stream_request_after_auth_model_and_price_validation() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
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

    assert_eq!("chatcmpl-test", payload["id"]);
    assert_eq!("pong", payload["choices"][0]["message"]["content"]);

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(101, captured[0].api_key_id);
    assert_eq!("standard-group", captured[0].group_code);
    assert_eq!("standard", captured[0].pricing_plan_code);
    assert_eq!("gpt-4o-mini", captured[0].model);
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!("openai/global/gpt-4o-mini", captured[0].provider_model);
    assert_eq!(
        Some("http://provider-proxy.internal/openrouter"),
        captured[0].provider_base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/main"),
        captured[0].provider_secret_ref.as_deref()
    );
    assert_eq!(Some(30_000), captured[0].provider_timeout_ms);
    assert_eq!(
        Some(ProviderRetryPolicy::new(3, vec![429, 503], 0).unwrap()),
        captured[0].provider_retry_policy
    );
    assert_eq!("ping", captured[0].request_body["messages"][0]["content"]);
}

#[tokio::test]
async fn openai_chat_completions_carries_channel_retry_policy_to_non_stream_relay() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!(Some(30_000), captured[0].provider_timeout_ms);
    assert_eq!(
        Some(ProviderRetryPolicy::new(3, vec![429, 503], 0).unwrap()),
        captured[0].provider_retry_policy
    );
}

#[tokio::test]
async fn openai_chat_completions_records_non_stream_usage_after_provider_success() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let relay_captured = Arc::new(Mutex::new(Vec::new()));
    let usage_captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&relay_captured)));
    let recorder = Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_captured)));
    let router =
        sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_usage_recorder(
            Arc::new(catalog_with_hashed_api_key(key_hash)),
            hasher,
            relay,
            recorder,
        );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-chat-usage-1")
                .header("x-trace-id", "trace-chat-usage-1")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());

    let captured = usage_captured.lock().unwrap();
    assert_eq!(1, captured.len());
    let command = &captured[0];
    assert_eq!("req-chat-usage-1", command.request_id);
    assert_eq!(Some("trace-chat-usage-1"), command.trace_id.as_deref());
    assert_eq!(10, command.tenant_id);
    assert_eq!(20, command.organization_id);
    assert_eq!(30, command.user_id);
    assert_eq!(101, command.api_key_id);
    assert_eq!(10, command.api_key_group_id);
    assert_eq!("standard-group", command.api_key_group_snapshot);
    assert_eq!("sk-live", command.api_key_name_snapshot);
    assert_eq!("openai/global/gpt-4o-mini", command.catalog_key);
    assert_eq!("gpt-4o-mini", command.requested_model);
    assert_eq!("openrouter", command.provider_code);
    assert_eq!(3001, command.channel_id);
    assert_eq!("openai/global/gpt-4o-mini", command.provider_model);
    assert_eq!("/v1/chat/completions", command.request_path);
    assert_eq!("POST", command.http_method);
    assert_eq!(200, command.http_status);
    assert!(!command.streaming);
    assert_eq!(1, command.prompt_tokens);
    assert_eq!(1, command.completion_tokens);
    assert_eq!(0, command.cached_tokens);
    assert_eq!(2, command.total_tokens);
    assert_eq!("0.198000", command.base_input_unit_price);
    assert_eq!("0.792000", command.base_output_unit_price);
    assert_eq!("0.990000", command.customer_charge_amount);
    assert_eq!("0.550000", command.upstream_cost_amount);
    assert_eq!("USD", command.currency);
    assert_eq!("standard", command.pricing_plan_code);
}

#[tokio::test]
async fn openai_chat_completions_rejects_usage_recording_when_success_response_omits_usage() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let usage_captured = Arc::new(Mutex::new(Vec::new()));
    let recorder = Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_captured)));
    let router =
        sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_usage_recorder(
            Arc::new(catalog_with_hashed_api_key(key_hash)),
            hasher,
            Arc::new(MissingUsageRelay),
            recorder,
        );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_GATEWAY, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!("provider_usage_record_failed", payload["error"]["code"]);
    assert!(usage_captured.lock().unwrap().is_empty());
}

#[tokio::test]
async fn openai_chat_completions_relays_stream_request_after_auth_model_and_price_validation() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let stream_relay = Arc::new(RecordingStreamRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_streaming_relay(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        stream_relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}],"stream":true}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    assert_eq!(
        Some("text/event-stream"),
        response
            .headers()
            .get("content-type")
            .and_then(|value| value.to_str().ok())
    );
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body = String::from_utf8(body.to_vec()).unwrap();

    assert!(body.contains("data: "));
    assert!(body.contains("chatcmpl-stream"));
    assert!(body.contains("data: [DONE]"));

    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(101, captured[0].api_key_id);
    assert_eq!("standard-group", captured[0].group_code);
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!("openai/global/gpt-4o-mini", captured[0].provider_model);
    assert_eq!(Some(30_000), captured[0].provider_timeout_ms);
    assert_eq!(true, captured[0].request_body["stream"]);
    assert_eq!("ping", captured[0].request_body["messages"][0]["content"]);
}

#[tokio::test]
async fn openai_chat_completions_records_stream_usage_after_provider_success() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let relay_captured = Arc::new(Mutex::new(Vec::new()));
    let usage_captured = Arc::new(Mutex::new(Vec::new()));
    let stream_relay = Arc::new(RecordingStreamRelay::new(Arc::clone(&relay_captured)));
    let recorder = Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_captured)));
    let router =
        sdkwork_claw_product::api::openai_chat_completions_router_with_relays_and_usage_recorder(
            Arc::new(catalog_with_hashed_api_key(key_hash)),
            hasher,
            Arc::new(RecordingRelay::new(Arc::new(Mutex::new(Vec::new())))),
            stream_relay,
            recorder,
        );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-chat-stream-usage-1")
                .header("x-trace-id", "trace-chat-stream-usage-1")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}],"stream":true}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body = String::from_utf8(body.to_vec()).unwrap();
    assert!(body.contains("chatcmpl-stream"));

    let captured = usage_captured.lock().unwrap();
    assert_eq!(1, captured.len());
    let command = &captured[0];
    assert_eq!("req-chat-stream-usage-1", command.request_id);
    assert_eq!(
        Some("trace-chat-stream-usage-1"),
        command.trace_id.as_deref()
    );
    assert!(command.streaming);
    assert_eq!(1, command.prompt_tokens);
    assert_eq!(1, command.completion_tokens);
    assert_eq!(2, command.total_tokens);
    assert_eq!("0.990000", command.customer_charge_amount);
    assert_eq!("0.550000", command.upstream_cost_amount);
}

#[tokio::test]
async fn openai_chat_completions_records_stream_usage_from_crlf_sse_events() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let relay_captured = Arc::new(Mutex::new(Vec::new()));
    let usage_captured = Arc::new(Mutex::new(Vec::new()));
    let stream_relay = Arc::new(RecordingStreamRelay::with_body(
        Arc::clone(&relay_captured),
        "data: {\"id\":\"chatcmpl-stream-crlf\",\"choices\":[{\"delta\":{\"content\":\"pong\"}}]}\r\n\r\ndata: {\"id\":\"chatcmpl-stream-crlf\",\"choices\":[],\"usage\":{\"prompt_tokens\":3,\"completion_tokens\":5,\"total_tokens\":8}}\r\n\r\ndata: [DONE]\r\n\r\n",
    ));
    let recorder = Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_captured)));
    let router =
        sdkwork_claw_product::api::openai_chat_completions_router_with_relays_and_usage_recorder(
            Arc::new(catalog_with_hashed_api_key(key_hash)),
            hasher,
            Arc::new(RecordingRelay::new(Arc::new(Mutex::new(Vec::new())))),
            stream_relay,
            recorder,
        );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-chat-stream-usage-crlf-1")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}],"stream":true}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body = String::from_utf8(body.to_vec()).unwrap();
    assert!(body.contains("chatcmpl-stream-crlf"));

    let captured = usage_captured.lock().unwrap();
    assert_eq!(1, captured.len());
    let command = &captured[0];
    assert_eq!("req-chat-stream-usage-crlf-1", command.request_id);
    assert!(command.streaming);
    assert_eq!(3, command.prompt_tokens);
    assert_eq!(5, command.completion_tokens);
    assert_eq!(8, command.total_tokens);
    assert_eq!("4.554000", command.customer_charge_amount);
    assert_eq!("2.530000", command.upstream_cost_amount);
}

#[tokio::test]
async fn openai_chat_completions_fails_stream_body_when_provider_omits_usage() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let relay_captured = Arc::new(Mutex::new(Vec::new()));
    let usage_captured = Arc::new(Mutex::new(Vec::new()));
    let stream_relay = Arc::new(RecordingStreamRelay::with_body(
        Arc::clone(&relay_captured),
        "data: {\"id\":\"chatcmpl-stream-missing-usage\",\"choices\":[{\"delta\":{\"content\":\"pong\"}}]}\n\ndata: [DONE]\n\n",
    ));
    let recorder = Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_captured)));
    let router =
        sdkwork_claw_product::api::openai_chat_completions_router_with_relays_and_usage_recorder(
            Arc::new(catalog_with_hashed_api_key(key_hash)),
            hasher,
            Arc::new(RecordingRelay::new(Arc::new(Mutex::new(Vec::new())))),
            stream_relay,
            recorder,
        );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-chat-stream-missing-usage-1")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}],"stream":true}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body_error = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap_err();
    assert!(body_error
        .to_string()
        .contains("provider streaming chat completion response is missing usage"));

    let captured = usage_captured.lock().unwrap();
    assert!(captured.is_empty());
}
