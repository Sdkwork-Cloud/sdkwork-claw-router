use std::sync::Arc;
use std::sync::Mutex;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::api::{
    OpenAiInvocationContext, OpenAiInvocationFault, OpenAiInvocationPlugin,
    OpenAiInvocationPluginError, OpenAiInvocationPluginFuture, OpenAiInvocationRelayOutcome,
    OpenAiProviderRoute, OpenAiRuntimeFailureStrategy, OpenAiRuntimeRouteConfig,
};
use sdkwork_claw_product::application::ApiKeySecretHasher;
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
    ProviderAccountPoolRoute, ProviderAuthProfile, ProviderRetryPolicy, RouteCandidate,
    RoutingCapability, RoutingPolicy, RoutingPolicyScope, RoutingRule,
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
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    add_group_routing_policy(
        &mut catalog,
        10,
        9001,
        9101,
        9102,
        "standard-group-gpt-4o-mini",
        "openai/global/gpt-4o-mini",
        3001,
    );
    catalog
}

fn catalog_with_hashed_api_key_missing_billing_subject(key_hash: String) -> InMemoryPricingCatalog {
    let mut catalog = catalog_with_hashed_api_key(key_hash.clone());
    catalog.add_api_key(GatewayApiKey::new(101, 10, "sk-live", &key_hash));
    catalog
}

fn catalog_with_hashed_api_key_without_routing(key_hash: String) -> InMemoryPricingCatalog {
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
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter", 3001)
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

fn add_group_routing_policy(
    catalog: &mut InMemoryPricingCatalog,
    group_id: i64,
    policy_id: i64,
    profile_id: i64,
    rule_id: i64,
    rule_code: &str,
    catalog_key: &str,
    channel_id: i64,
) {
    catalog.add_routing_policy(
        RoutingPolicy::new(
            policy_id,
            10,
            20,
            &format!("{rule_code}-policy"),
            RoutingPolicyScope::ApiKeyGroup,
            Some(group_id),
            Some(profile_id),
        )
        .with_capability(RoutingCapability::Chat),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            rule_id,
            10,
            20,
            profile_id,
            rule_code,
            1,
            &format!(r#"{{"catalogKey":"{catalog_key}"}}"#),
            catalog_key,
        )
        .with_candidate_channels(vec![RouteCandidate::new(channel_id, 100)]),
    );
}

fn catalog_with_group_account_pools(
    standard_key_hash: String,
    premium_key_hash: String,
) -> InMemoryPricingCatalog {
    let mut catalog = catalog_with_hashed_api_key(standard_key_hash);
    catalog.add_api_key_group(ApiKeyGroup::new(
        20,
        "premium-group",
        "standard",
        DecimalValue::parse("1.000000").unwrap(),
        DecimalValue::parse("1.000000").unwrap(),
    ));
    catalog.add_api_key(
        GatewayApiKey::new(202, 20, "sk-premium", &premium_key_hash).with_owner(10, 20, 31),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter-premium",
            3002,
            "openai/global/gpt-4o-mini-premium",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-premium"),
            Some("vault://providers/openrouter/account/premium"),
        )
        .with_timeout_ms(20_000),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter-premium", 3002)
            .with_provider_endpoint(
                Some("http://provider-proxy.internal/openrouter-premium"),
                Some("vault://providers/openrouter/account/premium"),
            )
            .with_timeout_ms(20_000),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.115000").unwrap(),
        )
        .for_provider("openrouter-premium", 3002),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmOutputToken,
            Money::usd("0.460000").unwrap(),
        )
        .for_provider("openrouter-premium", 3002),
    );
    add_group_routing_policy(
        &mut catalog,
        20,
        9201,
        9301,
        9302,
        "premium-group-gpt-4o-mini",
        "openai/global/gpt-4o-mini",
        3002,
    );
    catalog
}

fn catalog_with_regional_minimax_pricing_and_routes(key_hash: String) -> InMemoryPricingCatalog {
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
        .with_catalog_key("minimax/MiniMax-M2.7"),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "minimax/cn/MiniMax-M2.7",
            "MiniMax-M2.7",
            "minimax_direct",
            4001,
            "MiniMax-M2.7",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/minimax"),
            Some("vault://providers/minimax/account/cn"),
        ),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "minimax/global/MiniMax-M2.7",
            "MiniMax-M2.7",
            "minimax_global_direct",
            4002,
            "MiniMax-M2.7",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/minimax-global"),
            Some("vault://providers/minimax/account/global"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("minimax_direct", 4001).with_provider_endpoint(
            Some("http://provider-proxy.internal/minimax"),
            Some("vault://providers/minimax/account/cn"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("minimax_global_direct", 4002).with_provider_endpoint(
            Some("http://provider-proxy.internal/minimax-global"),
            Some("vault://providers/minimax/account/global"),
        ),
    );
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
    catalog.add_price(ModelPrice::new_for_catalog_key(
        "minimax/global/MiniMax-M2.7",
        "MiniMax-M2.7",
        PriceSide::OfficialReference,
        BillingMeter::LlmInputToken,
        Money::cny("0.006000").unwrap(),
    ));
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "minimax/global/MiniMax-M2.7",
            "MiniMax-M2.7",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::cny("0.006000").unwrap(),
        )
        .for_provider("minimax_global_direct", 4002),
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9401,
            10,
            20,
            "standard-group-minimax-policy",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(9501),
        )
        .with_capability(RoutingCapability::Chat),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            9502,
            10,
            20,
            9501,
            "standard-group-minimax-m27-base",
            1,
            r#"{"catalogKey":"minimax/MiniMax-M2.7"}"#,
            "minimax/MiniMax-M2.7",
        )
        .with_candidate_channels(vec![RouteCandidate::new(4001, 100)]),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            9503,
            10,
            20,
            9501,
            "standard-group-minimax-m27-cn",
            1,
            r#"{"catalogKey":"minimax/cn/MiniMax-M2.7"}"#,
            "minimax/cn/MiniMax-M2.7",
        )
        .with_candidate_channels(vec![RouteCandidate::new(4001, 100)]),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            9504,
            10,
            20,
            9501,
            "standard-group-minimax-m27-global",
            1,
            r#"{"catalogKey":"minimax/global/MiniMax-M2.7"}"#,
            "minimax/global/MiniMax-M2.7",
        )
        .with_candidate_channels(vec![RouteCandidate::new(4002, 100)]),
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
async fn openai_chat_completions_rejects_api_key_without_billing_subject_before_relay() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog_with_hashed_api_key_missing_billing_subject(
            key_hash,
        )),
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

    assert_eq!(StatusCode::INTERNAL_SERVER_ERROR, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let body = String::from_utf8(body.to_vec()).unwrap();
    let payload: serde_json::Value = serde_json::from_str(&body).unwrap();

    assert_eq!("billing_subject_missing", payload["error"]["code"]);
    assert_eq!("server_error", payload["error"]["type"]);
    let message = payload["error"]["message"].as_str().unwrap();
    assert!(message.contains("tenant"));
    assert!(message.contains("organization"));
    assert!(message.contains("user"));
    assert!(!body.contains("sk-live-secret"));
    assert!(captured.lock().unwrap().is_empty());
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
async fn openai_chat_completions_accepts_official_model_id_when_model_is_not_region_scoped() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_chat_completions_router(
        Arc::new(catalog_with_regional_minimax_pricing_and_routes(key_hash)),
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

    assert_eq!(StatusCode::NOT_IMPLEMENTED, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("provider_relay_not_configured", payload["error"]["code"]);
}

#[tokio::test]
async fn openai_chat_completions_accepts_catalog_key_for_regional_price_route_scope() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let router = sdkwork_claw_product::api::openai_chat_completions_router(
        Arc::new(catalog_with_regional_minimax_pricing_and_routes(key_hash)),
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

#[tokio::test]
async fn openai_chat_completions_routes_each_api_key_group_to_its_configured_account_pool() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let standard_key_hash = hasher.hash_secret("sk-standard-secret").unwrap();
    let premium_key_hash = hasher.hash_secret("sk-premium-secret").unwrap();
    let mut catalog = catalog_with_group_account_pools(standard_key_hash, premium_key_hash);
    catalog.add_routing_policy(RoutingPolicy::new(
        9001,
        10,
        20,
        "standard-group-policy",
        RoutingPolicyScope::ApiKeyGroup,
        Some(10),
        Some(9101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            9102,
            10,
            20,
            9101,
            "standard-group-gpt-4o-mini",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );
    catalog.add_routing_policy(RoutingPolicy::new(
        9002,
        10,
        20,
        "premium-group-policy",
        RoutingPolicyScope::ApiKeyGroup,
        Some(20),
        Some(9201),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            9202,
            10,
            20,
            9201,
            "premium-group-gpt-4o-mini",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3002, 100)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog),
        hasher,
        relay,
    );

    for api_key in ["sk-standard-secret", "sk-premium-secret"] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/v1/chat/completions")
                    .header("authorization", format!("Bearer {api_key}"))
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(StatusCode::OK, response.status());
    }

    let captured = captured.lock().unwrap();
    assert_eq!(2, captured.len());
    assert_eq!(101, captured[0].api_key_id);
    assert_eq!(10, captured[0].group_id);
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!(
        Some("http://provider-proxy.internal/openrouter"),
        captured[0].provider_base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/main"),
        captured[0].provider_secret_ref.as_deref()
    );
    assert_eq!(202, captured[1].api_key_id);
    assert_eq!(20, captured[1].group_id);
    assert_eq!("openrouter-premium", captured[1].provider_code);
    assert_eq!(
        Some("http://provider-proxy.internal/openrouter-premium"),
        captured[1].provider_base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/premium"),
        captured[1].provider_secret_ref.as_deref()
    );
    assert_eq!(
        "openai/global/gpt-4o-mini-premium",
        captured[1].provider_model
    );
}

#[tokio::test]
async fn openai_chat_completions_uses_group_account_pool_endpoint_for_selected_model_route() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-standard-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter", 3001)
            .with_provider_endpoint(
                Some("http://account-pool.internal/openrouter-standard"),
                Some("vault://providers/openrouter/account/standard-pool"),
            )
            .with_auth_profile(ProviderAuthProfile::header("x-api-key"))
            .with_timeout_ms(45_000)
            .with_retry_policy(ProviderRetryPolicy::new(4, vec![408, 429, 503], 50).unwrap()),
    );
    add_group_routing_policy(
        &mut catalog,
        10,
        9001,
        9101,
        9102,
        "standard-group-gpt-4o-mini",
        "openai/global/gpt-4o-mini",
        3001,
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-standard-secret")
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
    assert_eq!("openai/global/gpt-4o-mini", captured[0].provider_model);
    assert_eq!(
        Some("http://account-pool.internal/openrouter-standard"),
        captured[0].provider_base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/standard-pool"),
        captured[0].provider_secret_ref.as_deref()
    );
    assert_eq!(
        ProviderAuthProfile::header("x-api-key"),
        captured[0].provider_auth_profile
    );
    assert_eq!(Some(45_000), captured[0].provider_timeout_ms);
    assert_eq!(
        Some(ProviderRetryPolicy::new(4, vec![408, 429, 503], 50).unwrap()),
        captured[0].provider_retry_policy
    );
}

#[tokio::test]
async fn openai_chat_completions_rejects_misconfigured_group_account_pool_without_cross_pool_fallback(
) {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-standard-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_routing_policy(RoutingPolicy::new(
        9001,
        10,
        20,
        "standard-group-policy",
        RoutingPolicyScope::ApiKeyGroup,
        Some(10),
        Some(9101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            9102,
            10,
            20,
            9101,
            "standard-group-broken-pool",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(9999, 100)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-standard-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, response.status());
    assert!(captured.lock().unwrap().is_empty());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("provider_route_not_available", payload["error"]["code"]);
    assert!(payload["error"]["message"]
        .as_str()
        .unwrap()
        .contains("account pool"));
}

#[tokio::test]
async fn openai_chat_completions_reports_pricing_unavailable_for_callable_route_without_price() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-standard-secret").unwrap();
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
        ),
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
    add_group_routing_policy(
        &mut catalog,
        10,
        9001,
        9101,
        9102,
        "standard-group-gpt-4o-mini",
        "openai/global/gpt-4o-mini",
        3001,
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-standard-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    assert!(captured.lock().unwrap().is_empty());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("pricing_unavailable", payload["error"]["code"]);
    assert!(payload["error"]["message"]
        .as_str()
        .unwrap()
        .contains("official reference price"));
}

#[tokio::test]
async fn openai_chat_completions_rejects_group_policy_missing_chat_capability_without_global_fallback(
) {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-standard-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "global-openrouter",
            3003,
            "openai/global/gpt-4o-mini-global",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/global-openrouter"),
            Some("vault://providers/openrouter/account/global"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("global-openrouter", 3003).with_provider_endpoint(
            Some("http://provider-proxy.internal/global-openrouter"),
            Some("vault://providers/openrouter/account/global"),
        ),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.120000").unwrap(),
        )
        .for_provider("global-openrouter", 3003),
    );
    catalog.add_routing_policy(RoutingPolicy::new(
        8001,
        0,
        0,
        "global-chat-policy",
        RoutingPolicyScope::Global,
        None,
        Some(8101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            8102,
            0,
            0,
            8101,
            "global-chat-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3003, 100)]),
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-embedding-policy",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(9101),
        )
        .with_capability(RoutingCapability::Embedding),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            9102,
            10,
            20,
            9101,
            "standard-group-embedding-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-standard-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, response.status());
    assert!(captured.lock().unwrap().is_empty());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("provider_route_not_available", payload["error"]["code"]);
    assert!(payload["error"]["message"]
        .as_str()
        .unwrap()
        .contains("has no routing policy for capability"));
}

#[tokio::test]
async fn openai_chat_completions_rejects_configured_group_policy_without_matching_rule() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-standard-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_routing_policy(RoutingPolicy::new(
        9001,
        10,
        20,
        "standard-group-policy",
        RoutingPolicyScope::ApiKeyGroup,
        Some(10),
        Some(9101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            9102,
            10,
            20,
            9101,
            "standard-group-other-model",
            1,
            r#"{"catalogKey":"openai/global/other-model"}"#,
            "openai/global/other-model",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let relay = Arc::new(RecordingRelay::new(Arc::clone(&captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay(
        Arc::new(catalog),
        hasher,
        relay,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-standard-secret")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, response.status());
    assert!(captured.lock().unwrap().is_empty());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("provider_route_not_available", payload["error"]["code"]);
    assert!(payload["error"]["message"]
        .as_str()
        .unwrap()
        .contains("has no routing rule"));
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
struct FailingRelay;

impl ChatCompletionRelay for FailingRelay {
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
            Err(sdkwork_claw_product::domain::DomainError::new(
                "upstream connection failed",
            ))
        })
    }
}

#[derive(Debug)]
struct FailingPrimaryRelay {
    captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
    failing_provider_code: &'static str,
}

impl FailingPrimaryRelay {
    fn new(
        captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
        failing_provider_code: &'static str,
    ) -> Self {
        Self {
            captured,
            failing_provider_code,
        }
    }
}

#[derive(Debug)]
struct RetryableStatusPrimaryRelay {
    captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
    failing_provider_code: &'static str,
}

impl RetryableStatusPrimaryRelay {
    fn new(
        captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
        failing_provider_code: &'static str,
    ) -> Self {
        Self {
            captured,
            failing_provider_code,
        }
    }
}

impl ChatCompletionRelay for RetryableStatusPrimaryRelay {
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
        let provider_code = request.provider_code.clone();
        self.captured.lock().unwrap().push(request);
        Box::pin(async move {
            if provider_code == self.failing_provider_code {
                return Ok(ChatCompletionRelayResponse::json(
                    503,
                    serde_json::json!({
                        "error": {
                            "message": "upstream overloaded",
                            "type": "server_error",
                            "code": "overloaded"
                        }
                    }),
                ));
            }
            Ok(ChatCompletionRelayResponse::json(
                200,
                serde_json::json!({
                    "id": "chatcmpl-fallback",
                    "object": "chat.completion",
                    "model": "gpt-4o-mini",
                    "choices": [
                        {
                            "index": 0,
                            "message": {"role": "assistant", "content": "pong"},
                            "finish_reason": "stop"
                        }
                    ],
                    "usage": {"prompt_tokens": 2, "completion_tokens": 3, "total_tokens": 5}
                }),
            ))
        })
    }
}

impl ChatCompletionRelay for FailingPrimaryRelay {
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
        let provider_code = request.provider_code.clone();
        self.captured.lock().unwrap().push(request);
        Box::pin(async move {
            if provider_code == self.failing_provider_code {
                return Err(sdkwork_claw_product::domain::DomainError::new(
                    "upstream connection failed",
                ));
            }
            Ok(ChatCompletionRelayResponse::json(
                200,
                serde_json::json!({
                    "id": "chatcmpl-fallback",
                    "object": "chat.completion",
                    "model": "gpt-4o-mini",
                    "choices": [
                        {
                            "index": 0,
                            "message": {"role": "assistant", "content": "pong"},
                            "finish_reason": "stop"
                        }
                    ],
                    "usage": {"prompt_tokens": 2, "completion_tokens": 3, "total_tokens": 5}
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
struct FailingPrimaryStreamRelay {
    captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
    failing_provider_code: &'static str,
}

impl FailingPrimaryStreamRelay {
    fn new(
        captured: Arc<Mutex<Vec<ChatCompletionRelayRequest>>>,
        failing_provider_code: &'static str,
    ) -> Self {
        Self {
            captured,
            failing_provider_code,
        }
    }
}

impl ChatCompletionStreamRelay for FailingPrimaryStreamRelay {
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
        let provider_code = request.provider_code.clone();
        self.captured.lock().unwrap().push(request);
        Box::pin(async move {
            if provider_code == self.failing_provider_code {
                return Err(sdkwork_claw_product::domain::DomainError::new(
                    "upstream stream connection failed",
                ));
            }
            Ok(ChatCompletionStreamRelayResponse::new(
                200,
                Some("text/event-stream".to_owned()),
                axum::body::Body::from(
                    "data: {\"id\":\"chatcmpl-stream-fallback\",\"choices\":[{\"delta\":{\"content\":\"pong\"}}]}\n\ndata: {\"id\":\"chatcmpl-stream-fallback\",\"choices\":[],\"usage\":{\"prompt_tokens\":2,\"completion_tokens\":3,\"total_tokens\":5}}\n\ndata: [DONE]\n\n",
                ),
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

#[derive(Debug)]
struct RecordingInvocationPlugin {
    events: Arc<Mutex<Vec<String>>>,
}

impl RecordingInvocationPlugin {
    fn new(events: Arc<Mutex<Vec<String>>>) -> Self {
        Self { events }
    }
}

impl OpenAiInvocationPlugin for RecordingInvocationPlugin {
    fn before_route_selection<'a>(
        &'a self,
        context: &'a OpenAiInvocationContext,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events.lock().unwrap().push(format!(
            "before_route_selection:{}",
            context.requested_model
        ));
        Box::pin(async { Ok(()) })
    }

    fn after_route_selection<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        route: &'a mut OpenAiProviderRoute,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events.lock().unwrap().push(format!(
            "after_route_selection:{}:{}",
            route.provider_code, route.channel_id
        ));
        Box::pin(async { Ok(()) })
    }

    fn before_relay<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        route: &'a mut OpenAiProviderRoute,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events.lock().unwrap().push(format!(
            "before_relay:{}",
            route.provider_base_url.as_deref().unwrap_or_default()
        ));
        Box::pin(async { Ok(()) })
    }

    fn after_relay<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: &'a OpenAiProviderRoute,
        outcome: &'a OpenAiInvocationRelayOutcome,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events
            .lock()
            .unwrap()
            .push(format!("after_relay:{}", outcome.status_code));
        Box::pin(async { Ok(()) })
    }

    fn on_route_fault<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        route: &'a OpenAiProviderRoute,
        fault: &'a OpenAiInvocationFault,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events.lock().unwrap().push(format!(
            "route_fault:{}:{}",
            route.provider_code, fault.error_code
        ));
        Box::pin(async { Ok(()) })
    }

    fn on_route_success<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        route: &'a OpenAiProviderRoute,
        outcome: &'a OpenAiInvocationRelayOutcome,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events.lock().unwrap().push(format!(
            "route_success:{}:{}",
            route.provider_code, outcome.status_code
        ));
        Box::pin(async { Ok(()) })
    }
}

#[derive(Debug)]
struct BlockingInvocationPlugin {
    events: Arc<Mutex<Vec<String>>>,
}

impl BlockingInvocationPlugin {
    fn new(events: Arc<Mutex<Vec<String>>>) -> Self {
        Self { events }
    }
}

impl OpenAiInvocationPlugin for BlockingInvocationPlugin {
    fn before_relay<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        route: &'a mut OpenAiProviderRoute,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events
            .lock()
            .unwrap()
            .push(format!("blocked_before_relay:{}", route.provider_code));
        Box::pin(async {
            Err(OpenAiInvocationPluginError::new(
                StatusCode::TOO_MANY_REQUESTS,
                "quota_exceeded",
                "rate_limit_error",
                "request quota is exhausted",
            ))
        })
    }
}

#[derive(Debug)]
struct FailingAfterRelayInvocationPlugin {
    events: Arc<Mutex<Vec<String>>>,
}

impl FailingAfterRelayInvocationPlugin {
    fn new(events: Arc<Mutex<Vec<String>>>) -> Self {
        Self { events }
    }
}

impl OpenAiInvocationPlugin for FailingAfterRelayInvocationPlugin {
    fn after_relay<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: &'a OpenAiProviderRoute,
        outcome: &'a OpenAiInvocationRelayOutcome,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events
            .lock()
            .unwrap()
            .push(format!("after_relay_failed:{}", outcome.status_code));
        Box::pin(async {
            Err(OpenAiInvocationPluginError::new(
                StatusCode::BAD_GATEWAY,
                "monitoring_failed",
                "server_error",
                "monitoring sink is unavailable",
            ))
        })
    }

    fn on_error<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        _route: Option<&'a OpenAiProviderRoute>,
        error: &'a OpenAiInvocationPluginError,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events
            .lock()
            .unwrap()
            .push(format!("observed_error:{}", error.code));
        Box::pin(async { Ok(()) })
    }
}

#[derive(Debug)]
struct RecordingErrorInvocationPlugin {
    events: Arc<Mutex<Vec<String>>>,
}

impl RecordingErrorInvocationPlugin {
    fn new(events: Arc<Mutex<Vec<String>>>) -> Self {
        Self { events }
    }
}

impl OpenAiInvocationPlugin for RecordingErrorInvocationPlugin {
    fn on_error<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        route: Option<&'a OpenAiProviderRoute>,
        error: &'a OpenAiInvocationPluginError,
    ) -> OpenAiInvocationPluginFuture<'a> {
        self.events.lock().unwrap().push(format!(
            "error:{}:{}:{}",
            error.status_code.as_u16(),
            error.code,
            route
                .map(|route| route.provider_code.as_str())
                .unwrap_or("unrouted")
        ));
        Box::pin(async { Ok(()) })
    }
}

#[derive(Debug)]
struct AccountOverrideInvocationPlugin;

impl OpenAiInvocationPlugin for AccountOverrideInvocationPlugin {
    fn before_relay<'a>(
        &'a self,
        _context: &'a OpenAiInvocationContext,
        route: &'a mut OpenAiProviderRoute,
    ) -> OpenAiInvocationPluginFuture<'a> {
        route.provider_base_url = Some("http://plugin-account-pool.internal/openrouter".to_owned());
        route.provider_secret_ref = Some("vault://providers/openrouter/account/plugin".to_owned());
        route.provider_auth_profile = ProviderAuthProfile::header("x-api-key");
        route.provider_timeout_ms = Some(12_000);
        Box::pin(async { Ok(()) })
    }
}

#[tokio::test]
async fn openai_chat_completions_fails_over_to_rule_fallback_after_primary_relay_failure() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter-fallback",
            3002,
            "openai/global/gpt-4o-mini-fallback",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter-fallback", 3002).with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.120000").unwrap(),
        )
        .for_provider("openrouter-fallback", 3002),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmOutputToken,
            Money::usd("0.480000").unwrap(),
        )
        .for_provider("openrouter-fallback", 3002),
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-failover-policy",
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
            "standard-group-gpt-4o-mini-failover",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)])
        .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let usage_records = Arc::new(Mutex::new(Vec::new()));
    let error_events = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_usage_recorder_and_plugins(
        Arc::new(catalog),
        hasher,
        Arc::new(FailingPrimaryRelay::new(Arc::clone(&captured), "openrouter")),
        Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_records))),
        vec![Arc::new(RecordingErrorInvocationPlugin::new(Arc::clone(&error_events)))],
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-failover")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(2, captured.len());
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!("openrouter-fallback", captured[1].provider_code);

    let usage_records = usage_records.lock().unwrap();
    assert_eq!(1, usage_records.len());
    assert_eq!("req-failover", usage_records[0].request_id);
    assert_eq!("openrouter-fallback", usage_records[0].provider_code);
    assert_eq!(3002, usage_records[0].channel_id);
    assert_eq!(2, usage_records[0].prompt_tokens);
    assert_eq!(3, usage_records[0].completion_tokens);

    assert_eq!(
        vec!["error:502:provider_relay_failed:openrouter"],
        *error_events.lock().unwrap()
    );
}

#[tokio::test]
async fn openai_chat_completions_fails_over_after_retryable_provider_status() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter-fallback",
            3002,
            "openai/global/gpt-4o-mini-fallback",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter-fallback", 3002).with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    for meter in [BillingMeter::LlmInputToken, BillingMeter::LlmOutputToken] {
        catalog.add_price(
            ModelPrice::new_for_catalog_key(
                "openai/global/gpt-4o-mini",
                "gpt-4o-mini",
                PriceSide::UpstreamCost,
                meter,
                Money::usd("0.120000").unwrap(),
            )
            .for_provider("openrouter-fallback", 3002),
        );
    }
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-failover-policy",
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
            "standard-group-gpt-4o-mini-failover",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)])
        .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let usage_records = Arc::new(Mutex::new(Vec::new()));
    let router =
        sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_usage_recorder(
            Arc::new(catalog),
            hasher,
            Arc::new(RetryableStatusPrimaryRelay::new(
                Arc::clone(&captured),
                "openrouter",
            )),
            Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_records))),
        );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-http-failover")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(2, captured.len());
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!("openrouter-fallback", captured[1].provider_code);
    assert_eq!(3002, usage_records.lock().unwrap()[0].channel_id);
}

#[tokio::test]
async fn openai_chat_completions_uses_runtime_default_retry_policy_for_status_failover() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter", 3001)
            .with_provider_endpoint(
                Some("http://provider-proxy.internal/openrouter"),
                Some("vault://providers/openrouter/account/main"),
            )
            .with_timeout_ms(30_000),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter-fallback",
            3002,
            "openai/global/gpt-4o-mini-fallback",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter-fallback", 3002).with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    for meter in [BillingMeter::LlmInputToken, BillingMeter::LlmOutputToken] {
        catalog.add_price(
            ModelPrice::new_for_catalog_key(
                "openai/global/gpt-4o-mini",
                "gpt-4o-mini",
                PriceSide::UpstreamCost,
                meter,
                Money::usd("0.120000").unwrap(),
            )
            .for_provider("openrouter-fallback", 3002),
        );
    }
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-failover-policy",
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
            "standard-group-gpt-4o-mini-failover",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)])
        .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let usage_records = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_usage_recorder_plugins_and_runtime_config(
        Arc::new(catalog),
        hasher,
        Arc::new(RetryableStatusPrimaryRelay::new(
            Arc::clone(&captured),
            "openrouter",
        )),
        Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_records))),
        Vec::new(),
        OpenAiRuntimeRouteConfig::new(
            ProviderRetryPolicy::new(2, vec![429], 0).unwrap(),
            OpenAiRuntimeFailureStrategy::Failover,
        ),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-http-runtime-retry-policy")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!("openrouter", captured[0].provider_code);
    assert!(usage_records.lock().unwrap().is_empty());
}

#[tokio::test]
async fn openai_chat_completions_fail_closed_strategy_stops_after_retryable_provider_status() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter-fallback",
            3002,
            "openai/global/gpt-4o-mini-fallback",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter-fallback", 3002).with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    for meter in [BillingMeter::LlmInputToken, BillingMeter::LlmOutputToken] {
        catalog.add_price(
            ModelPrice::new_for_catalog_key(
                "openai/global/gpt-4o-mini",
                "gpt-4o-mini",
                PriceSide::UpstreamCost,
                meter,
                Money::usd("0.120000").unwrap(),
            )
            .for_provider("openrouter-fallback", 3002),
        );
    }
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-failover-policy",
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
            "standard-group-gpt-4o-mini-failover",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)])
        .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let usage_records = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_usage_recorder_plugins_and_failure_strategy(
        Arc::new(catalog),
        hasher,
        Arc::new(RetryableStatusPrimaryRelay::new(
            Arc::clone(&captured),
            "openrouter",
        )),
        Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_records))),
        Vec::new(),
        OpenAiRuntimeFailureStrategy::FailClosed,
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-http-fail-closed")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::SERVICE_UNAVAILABLE, response.status());
    let captured = captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!("openrouter", captured[0].provider_code);
    assert!(usage_records.lock().unwrap().is_empty());
}

#[tokio::test]
async fn openai_chat_completions_stream_fails_over_to_rule_fallback_before_response_start() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let mut catalog = catalog_with_hashed_api_key_without_routing(key_hash);
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            "openrouter-fallback",
            3002,
            "openai/global/gpt-4o-mini-fallback",
        )
        .with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new("openrouter-fallback", 3002).with_provider_endpoint(
            Some("http://provider-proxy.internal/openrouter-fallback"),
            Some("vault://providers/openrouter/account/fallback"),
        ),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.120000").unwrap(),
        )
        .for_provider("openrouter-fallback", 3002),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmOutputToken,
            Money::usd("0.480000").unwrap(),
        )
        .for_provider("openrouter-fallback", 3002),
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            9001,
            10,
            20,
            "standard-group-stream-failover-policy",
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
            "standard-group-gpt-4o-mini-stream-failover",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)])
        .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
    );

    let captured = Arc::new(Mutex::new(Vec::new()));
    let usage_records = Arc::new(Mutex::new(Vec::new()));
    let events = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relays_and_usage_recorder_and_plugins(
        Arc::new(catalog),
        hasher,
        Arc::new(RecordingRelay::new(Arc::new(Mutex::new(Vec::new())))),
        Arc::new(FailingPrimaryStreamRelay::new(Arc::clone(&captured), "openrouter")),
        Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_records))),
        vec![Arc::new(RecordingInvocationPlugin::new(Arc::clone(&events)))],
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-stream-failover")
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
    assert!(body.contains("chatcmpl-stream-fallback"));

    let captured = captured.lock().unwrap();
    assert_eq!(2, captured.len());
    assert_eq!("openrouter", captured[0].provider_code);
    assert_eq!("openrouter-fallback", captured[1].provider_code);

    let usage_records = usage_records.lock().unwrap();
    assert_eq!(1, usage_records.len());
    assert_eq!("req-stream-failover", usage_records[0].request_id);
    assert!(usage_records[0].streaming);
    assert_eq!("openrouter-fallback", usage_records[0].provider_code);
    assert_eq!(3002, usage_records[0].channel_id);

    let events = events.lock().unwrap();
    assert!(events.contains(&"route_fault:openrouter:provider_relay_failed".to_owned()));
    assert!(events.contains(&"route_success:openrouter-fallback:200".to_owned()));
}

#[tokio::test]
async fn openai_chat_invocation_plugins_observe_route_and_relay_lifecycle() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let events = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_plugins(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        Arc::new(RecordingRelay::new(Arc::clone(&captured))),
        vec![Arc::new(RecordingInvocationPlugin::new(Arc::clone(
            &events,
        )))],
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
    assert_eq!(
        vec![
            "before_route_selection:gpt-4o-mini",
            "after_route_selection:openrouter:3001",
            "before_relay:http://provider-proxy.internal/openrouter",
            "route_success:openrouter:200",
            "after_relay:200",
        ],
        *events.lock().unwrap()
    );
    assert_eq!(1, captured.lock().unwrap().len());
}

#[tokio::test]
async fn openai_chat_invocation_plugin_can_short_circuit_before_relay_without_calling_provider() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let events = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_plugins(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        Arc::new(RecordingRelay::new(Arc::clone(&captured))),
        vec![Arc::new(BlockingInvocationPlugin::new(Arc::clone(&events)))],
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

    assert_eq!(StatusCode::TOO_MANY_REQUESTS, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!("quota_exceeded", payload["error"]["code"]);
    assert_eq!(
        vec!["blocked_before_relay:openrouter"],
        *events.lock().unwrap()
    );
    assert!(captured.lock().unwrap().is_empty());
}

#[tokio::test]
async fn openai_chat_invocation_plugin_observes_provider_relay_errors() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let events = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_plugins(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        Arc::new(FailingRelay),
        vec![Arc::new(RecordingErrorInvocationPlugin::new(Arc::clone(
            &events,
        )))],
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
    assert_eq!(
        vec!["error:502:provider_relay_failed:openrouter"],
        *events.lock().unwrap()
    );
}

#[tokio::test]
async fn openai_chat_invocation_plugin_can_override_selected_provider_account_before_relay() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let captured = Arc::new(Mutex::new(Vec::new()));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_plugins(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        Arc::new(RecordingRelay::new(Arc::clone(&captured))),
        vec![Arc::new(AccountOverrideInvocationPlugin)],
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
    assert_eq!(
        Some("http://plugin-account-pool.internal/openrouter"),
        captured[0].provider_base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/plugin"),
        captured[0].provider_secret_ref.as_deref()
    );
    assert_eq!(
        ProviderAuthProfile::header("x-api-key"),
        captured[0].provider_auth_profile
    );
    assert_eq!(Some(12_000), captured[0].provider_timeout_ms);
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
    assert_eq!(10, captured[0].tenant_id);
    assert_eq!(20, captured[0].organization_id);
    assert_eq!(30, captured[0].user_id);
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
async fn openai_chat_completions_records_usage_even_when_after_relay_observer_fails() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let usage_captured = Arc::new(Mutex::new(Vec::new()));
    let events = Arc::new(Mutex::new(Vec::new()));
    let recorder = Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_captured)));
    let router = sdkwork_claw_product::api::openai_chat_completions_router_with_relay_and_usage_recorder_and_plugins(
        Arc::new(catalog_with_hashed_api_key(key_hash)),
        hasher,
        Arc::new(RecordingRelay::new(Arc::new(Mutex::new(Vec::new())))),
        recorder,
        vec![Arc::new(FailingAfterRelayInvocationPlugin::new(Arc::clone(&events)))],
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-chat-after-relay-observer-fails")
                .body(Body::from(
                    r#"{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    assert_eq!(
        vec!["after_relay_failed:200", "observed_error:monitoring_failed"],
        *events.lock().unwrap()
    );
    let captured = usage_captured.lock().unwrap();
    assert_eq!(1, captured.len());
    assert_eq!(
        "req-chat-after-relay-observer-fails",
        captured[0].request_id
    );
    assert_eq!("0.990000", captured[0].customer_charge_amount);
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

#[tokio::test]
async fn openai_chat_completions_reports_stream_usage_recording_failures_to_invocation_plugins() {
    let hasher =
        Arc::new(HmacSha256ApiKeySecretHasher::new("0123456789abcdef0123456789abcdef").unwrap());
    let key_hash = hasher.hash_secret("sk-live-secret").unwrap();
    let relay_captured = Arc::new(Mutex::new(Vec::new()));
    let usage_captured = Arc::new(Mutex::new(Vec::new()));
    let events = Arc::new(Mutex::new(Vec::new()));
    let stream_relay = Arc::new(RecordingStreamRelay::with_body(
        Arc::clone(&relay_captured),
        "data: {\"id\":\"chatcmpl-stream-missing-usage\",\"choices\":[{\"delta\":{\"content\":\"pong\"}}]}\n\ndata: [DONE]\n\n",
    ));
    let recorder = Arc::new(RecordingUsageRecorder::new(Arc::clone(&usage_captured)));
    let router =
        sdkwork_claw_product::api::openai_chat_completions_router_with_relays_and_usage_recorder_and_plugins(
            Arc::new(catalog_with_hashed_api_key(key_hash)),
            hasher,
            Arc::new(RecordingRelay::new(Arc::new(Mutex::new(Vec::new())))),
            stream_relay,
            recorder,
            vec![Arc::new(RecordingInvocationPlugin::new(Arc::clone(&events)))],
        );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/v1/chat/completions")
                .header("authorization", "Bearer sk-live-secret")
                .header("content-type", "application/json")
                .header("x-request-id", "req-chat-stream-missing-usage-plugin")
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
    assert!(usage_captured.lock().unwrap().is_empty());

    let events = events.lock().unwrap();
    assert!(events.contains(&"route_success:openrouter:200".to_owned()));
    assert!(events.contains(&"after_relay:200".to_owned()));
    assert!(events.contains(&"route_fault:openrouter:provider_usage_record_failed".to_owned()));
}
