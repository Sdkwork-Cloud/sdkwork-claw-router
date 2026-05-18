use sdkwork_claw_product::application::{
    AuthenticatedApiKeyContext, ProviderRouteSelectionErrorKind, ProviderRouteSelector,
    SelectProviderAccountPoolRouteQuery, SelectProviderRouteQuery,
};
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
    ProviderAccountPoolRoute, RouteCandidate, RoutingCapability, RoutingFallbackMode,
    RoutingPolicy, RoutingPolicyScope, RoutingRule,
};
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;

fn base_catalog() -> InMemoryPricingCatalog {
    let mut catalog = InMemoryPricingCatalog::default();
    catalog.add_vendor(ModelVendorDefinition::new(
        "openai",
        ModelVendor::OpenAi,
        "OpenAI",
    ));
    catalog.add_model(
        AiModel::new(
            "gpt-4o-mini",
            "GPT-4o mini",
            "openai",
            vec!["chat", "tools"],
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
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
    catalog
        .add_api_key(GatewayApiKey::new(100, 10, "sk-test", "hash:sk-test").with_owner(10, 20, 30));
    catalog.add_price(ModelPrice::new_for_catalog_key(
        "openai/global/gpt-4o-mini",
        "gpt-4o-mini",
        PriceSide::OfficialReference,
        BillingMeter::LlmInputToken,
        Money::usd("0.150000").unwrap(),
    ));
    catalog
}

fn add_callable_route(
    catalog: &mut InMemoryPricingCatalog,
    channel_id: i64,
    provider_code: &str,
    provider_model: &str,
    unit_price: &str,
) {
    catalog.add_provider_route(
        ModelProviderRoute::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            provider_code,
            channel_id,
            provider_model,
        )
        .with_provider_endpoint(
            Some(format!("http://provider-proxy.internal/{provider_code}")),
            Some(format!("vault://providers/{provider_code}/account/main")),
        ),
    );
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd(unit_price).unwrap(),
        )
        .for_provider(provider_code, channel_id),
    );
}

fn add_callable_account_pool_route(
    catalog: &mut InMemoryPricingCatalog,
    channel_id: i64,
    provider_code: &str,
) {
    catalog.add_provider_account_pool_route(
        ProviderAccountPoolRoute::new(provider_code, channel_id).with_provider_endpoint(
            Some(format!("http://provider-proxy.internal/{provider_code}")),
            Some(format!("vault://providers/{provider_code}/account/main")),
        ),
    );
}

fn add_group_policy_rule(
    catalog: &mut InMemoryPricingCatalog,
    policy_id: i64,
    profile_id: i64,
    rule_id: i64,
    rule_match: &str,
    target_model: &str,
    candidate_channels: Vec<RouteCandidate>,
    fallback_chain: Vec<RouteCandidate>,
) {
    catalog.add_routing_policy(RoutingPolicy::new(
        policy_id,
        10,
        20,
        &format!("group-policy-{policy_id}"),
        RoutingPolicyScope::ApiKeyGroup,
        Some(10),
        Some(profile_id),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            rule_id,
            10,
            20,
            profile_id,
            &format!("rule-{rule_id}"),
            1,
            rule_match,
            target_model,
        )
        .with_candidate_channels(candidate_channels)
        .with_fallback_chain(fallback_chain),
    );
}

fn authenticated_context() -> AuthenticatedApiKeyContext {
    AuthenticatedApiKeyContext {
        api_key_id: 100,
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        api_key_name_snapshot: "sk-test".to_owned(),
        group_id: 10,
        group_code: "standard-group".to_owned(),
        pricing_plan_code: "standard".to_owned(),
    }
}

fn select_query() -> SelectProviderRouteQuery {
    SelectProviderRouteQuery {
        context: authenticated_context(),
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        requested_model: "gpt-4o-mini".to_owned(),
        capability: RoutingCapability::Chat,
        billing_meter: BillingMeter::LlmInputToken,
    }
}

fn select_account_pool_query(route_key: &str) -> SelectProviderAccountPoolRouteQuery {
    SelectProviderAccountPoolRouteQuery {
        context: authenticated_context(),
        route_key: route_key.to_owned(),
        capability: RoutingCapability::Chat,
    }
}

#[test]
fn selector_prefers_api_key_group_policy_over_global_policy() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-main",
        "gpt-4o-mini-main",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "openrouter-premium",
        "gpt-4o-mini-premium",
        "0.125000",
    );
    catalog.add_routing_policy(RoutingPolicy::new(
        1,
        0,
        0,
        "global-policy",
        RoutingPolicyScope::Global,
        None,
        Some(101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            102,
            0,
            0,
            101,
            "global-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
        "openai/global/gpt-4o-mini",
        vec![RouteCandidate::new(3002, 100)],
        vec![],
    );

    let selection = ProviderRouteSelector::new(&catalog)
        .select(select_query())
        .unwrap();

    assert_eq!(3002, selection.route.channel_id);
    assert_eq!(Some(2), selection.policy_id);
    assert_eq!(Some(202), selection.rule_id);
}

#[test]
fn selector_prefers_policy_matching_the_request_capability() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-chat",
        "gpt-4o-mini-chat",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "openrouter-embedding",
        "gpt-4o-mini-embedding",
        "0.125000",
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            1,
            10,
            20,
            "group-embedding-policy",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(101),
        )
        .with_capability(RoutingCapability::Embedding),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            102,
            10,
            20,
            101,
            "embedding-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3002, 100)]),
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            2,
            10,
            20,
            "group-chat-policy",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(201),
        )
        .with_capability(RoutingCapability::Chat),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            202,
            10,
            20,
            201,
            "chat-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );

    let selection = ProviderRouteSelector::new(&catalog)
        .select(SelectProviderRouteQuery {
            capability: RoutingCapability::Chat,
            ..select_query()
        })
        .unwrap();

    assert_eq!(3001, selection.route.channel_id);
    assert_eq!(Some(2), selection.policy_id);
    assert_eq!(Some(202), selection.rule_id);
}

#[test]
fn selector_prefers_capability_specific_policy_over_generic_policy_in_same_scope() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "generic-openrouter",
        "gpt-4o-mini-generic",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "chat-openrouter",
        "gpt-4o-mini-chat",
        "0.125000",
    );
    add_group_policy_rule(
        &mut catalog,
        1,
        101,
        102,
        r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
        "openai/global/gpt-4o-mini",
        vec![RouteCandidate::new(3001, 100)],
        vec![],
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            2,
            10,
            20,
            "group-chat-policy",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(201),
        )
        .with_capability(RoutingCapability::Chat),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            202,
            10,
            20,
            201,
            "chat-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3002, 100)]),
    );

    let selection = ProviderRouteSelector::new(&catalog)
        .select(SelectProviderRouteQuery {
            capability: RoutingCapability::Chat,
            ..select_query()
        })
        .unwrap();

    assert_eq!(3002, selection.route.channel_id);
    assert_eq!(Some(2), selection.policy_id);
    assert_eq!(Some(202), selection.rule_id);
}

#[test]
fn selector_rejects_group_policy_without_requested_capability_instead_of_global_fallback() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "global-openrouter",
        "gpt-4o-mini-global",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "embedding-openrouter",
        "gpt-4o-mini-embedding",
        "0.125000",
    );
    catalog.add_routing_policy(RoutingPolicy::new(
        1,
        0,
        0,
        "global-chat-policy",
        RoutingPolicyScope::Global,
        None,
        Some(101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            102,
            0,
            0,
            101,
            "global-chat-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            2,
            10,
            20,
            "group-embedding-policy",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(201),
        )
        .with_capability(RoutingCapability::Embedding),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            202,
            10,
            20,
            201,
            "embedding-rule",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3002, 100)]),
    );

    let error = ProviderRouteSelector::new(&catalog)
        .select(SelectProviderRouteQuery {
            capability: RoutingCapability::Chat,
            ..select_query()
        })
        .unwrap_err();

    assert_eq!(
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable,
        error.kind()
    );
    assert!(error
        .to_string()
        .contains("api key group policy scope has no routing policy for capability Chat"));
}

#[test]
fn selector_uses_configured_fallback_chain_without_legacy_cross_pool_fallback() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-main",
        "gpt-4o-mini-main",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "openrouter-fallback",
        "gpt-4o-mini-fallback",
        "0.130000",
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
        "openai/global/gpt-4o-mini",
        vec![RouteCandidate::new(9999, 100)],
        vec![RouteCandidate::new(3002, 50)],
    );

    let selection = ProviderRouteSelector::new(&catalog)
        .select(select_query())
        .unwrap();

    assert_eq!(3002, selection.route.channel_id);
    assert_eq!("openrouter-fallback", selection.route.provider_code);
}

#[test]
fn selector_plan_includes_primary_and_enabled_fallback_candidates() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-main",
        "gpt-4o-mini-main",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "openrouter-fallback",
        "gpt-4o-mini-fallback",
        "0.130000",
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
        "openai/global/gpt-4o-mini",
        vec![RouteCandidate::new(3001, 100)],
        vec![RouteCandidate::new(3002, 50)],
    );

    let plan = ProviderRouteSelector::new(&catalog)
        .select_plan(select_query())
        .unwrap();

    let channel_ids = plan
        .routes
        .iter()
        .map(|selection| selection.route.channel_id)
        .collect::<Vec<_>>();
    assert_eq!(vec![3001, 3002], channel_ids);
    assert_eq!(Some(2), plan.policy_id);
    assert_eq!(Some(202), plan.rule_id);
}

#[test]
fn selector_plan_respects_policy_fallback_mode_none() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-main",
        "gpt-4o-mini-main",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "openrouter-fallback",
        "gpt-4o-mini-fallback",
        "0.130000",
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            2,
            10,
            20,
            "group-policy-no-fallback",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(201),
        )
        .with_fallback_mode(RoutingFallbackMode::None),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            202,
            10,
            20,
            201,
            "rule-with-disabled-fallback",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)])
        .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
    );

    let plan = ProviderRouteSelector::new(&catalog)
        .select_plan(select_query())
        .unwrap();

    let channel_ids = plan
        .routes
        .iter()
        .map(|selection| selection.route.channel_id)
        .collect::<Vec<_>>();
    assert_eq!(vec![3001], channel_ids);
}

#[test]
fn selector_rejects_rule_fallback_chain_when_policy_fallback_mode_is_none() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-primary",
        "gpt-4o-mini-main",
        "0.110000",
    );
    add_callable_route(
        &mut catalog,
        3002,
        "openrouter-fallback",
        "gpt-4o-mini-fallback",
        "0.130000",
    );
    catalog.add_routing_policy(
        RoutingPolicy::new(
            2,
            10,
            20,
            "group-policy-no-fallback",
            RoutingPolicyScope::ApiKeyGroup,
            Some(10),
            Some(201),
        )
        .with_fallback_mode(RoutingFallbackMode::None),
    );
    catalog.add_routing_rule(
        RoutingRule::new(
            202,
            10,
            20,
            201,
            "rule-with-disabled-fallback",
            1,
            r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
            "openai/global/gpt-4o-mini",
        )
        .with_candidate_channels(vec![RouteCandidate::new(9999, 100)])
        .with_fallback_chain(vec![RouteCandidate::new(3002, 50)]),
    );

    let error = ProviderRouteSelector::new(&catalog)
        .select(select_query())
        .unwrap_err();

    assert_eq!(
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable,
        error.kind()
    );
    assert!(error.to_string().contains("fallback mode none"));
}

#[test]
fn selector_rejects_matched_policy_rule_when_candidate_channel_is_not_callable() {
    let mut catalog = base_catalog();
    catalog.add_provider_route(ModelProviderRoute::new_for_catalog_key(
        "openai/global/gpt-4o-mini",
        "gpt-4o-mini",
        "openrouter-main",
        3001,
        "gpt-4o-mini-main",
    ));
    catalog.add_price(
        ModelPrice::new_for_catalog_key(
            "openai/global/gpt-4o-mini",
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.110000").unwrap(),
        )
        .for_provider("openrouter-main", 3001),
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
        "openai/global/gpt-4o-mini",
        vec![RouteCandidate::new(3001, 100)],
        vec![],
    );

    let error = ProviderRouteSelector::new(&catalog)
        .select(select_query())
        .unwrap_err();

    assert_eq!(
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable,
        error.kind()
    );
    assert!(error.to_string().contains("callable priced candidate"));
}

#[test]
fn selector_reports_pricing_unavailable_when_callable_candidate_has_no_price() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-main",
        "gpt-4o-mini-main",
        "0.110000",
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"catalogKey":"openai/global/gpt-4o-mini"}"#,
        "openai/global/gpt-4o-mini",
        vec![RouteCandidate::new(3001, 100)],
        vec![],
    );

    let error = ProviderRouteSelector::new(&catalog)
        .select(SelectProviderRouteQuery {
            billing_meter: BillingMeter::LlmOutputToken,
            ..select_query()
        })
        .unwrap_err();

    assert_eq!(
        ProviderRouteSelectionErrorKind::PricingUnavailable,
        error.kind()
    );
    assert!(error.to_string().contains("official reference price"));
}

#[test]
fn selector_rejects_matched_policy_without_matching_rule() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-main",
        "gpt-4o-mini-main",
        "0.110000",
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"catalogKey":"openai/global/other-model"}"#,
        "openai/global/other-model",
        vec![RouteCandidate::new(3001, 100)],
        vec![],
    );

    let error = ProviderRouteSelector::new(&catalog)
        .select(select_query())
        .unwrap_err();

    assert_eq!(
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable,
        error.kind()
    );
    assert!(error.to_string().contains("has no routing rule"));
}

#[test]
fn selector_requires_explicit_routing_policy_scope() {
    let mut catalog = base_catalog();
    add_callable_route(
        &mut catalog,
        3001,
        "openrouter-main",
        "gpt-4o-mini-main",
        "0.110000",
    );

    let error = ProviderRouteSelector::new(&catalog)
        .select(select_query())
        .unwrap_err();

    assert_eq!(
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable,
        error.kind()
    );
    assert!(error
        .to_string()
        .contains("routing policy scope is required"));
}

#[test]
fn selector_selects_account_pool_route_by_route_key_without_model_pricing() {
    let mut catalog = base_catalog();
    add_callable_account_pool_route(&mut catalog, 3001, "openrouter-main");
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"routeKey":"openai/management/files"}"#,
        "",
        vec![RouteCandidate::new(3001, 100)],
        vec![],
    );

    let selection = ProviderRouteSelector::new(&catalog)
        .select_account_pool(select_account_pool_query("openai/management/files"))
        .unwrap();

    assert_eq!(3001, selection.route.channel_id);
    assert_eq!("openrouter-main", selection.route.provider_code);
    assert_eq!(Some(2), selection.policy_id);
    assert_eq!(Some(202), selection.rule_id);
}

#[test]
fn selector_prefers_api_key_group_account_pool_over_global_policy() {
    let mut catalog = base_catalog();
    add_callable_account_pool_route(&mut catalog, 3001, "openrouter-global");
    add_callable_account_pool_route(&mut catalog, 3002, "openrouter-group");
    catalog.add_routing_policy(RoutingPolicy::new(
        1,
        0,
        0,
        "global-management-policy",
        RoutingPolicyScope::Global,
        None,
        Some(101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            102,
            0,
            0,
            101,
            "global-files-rule",
            1,
            r#"{"routeKey":"openai/management/files"}"#,
            "",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"routeKey":"openai/management/files"}"#,
        "",
        vec![RouteCandidate::new(3002, 100)],
        vec![],
    );

    let selection = ProviderRouteSelector::new(&catalog)
        .select_account_pool(select_account_pool_query("openai/management/files"))
        .unwrap();

    assert_eq!(3002, selection.route.channel_id);
    assert_eq!(Some(2), selection.policy_id);
    assert_eq!(Some(202), selection.rule_id);
}

#[test]
fn selector_falls_back_to_global_default_account_pool_when_group_has_no_route_key_rule() {
    let mut catalog = base_catalog();
    add_callable_account_pool_route(&mut catalog, 3001, "openrouter-default");
    add_callable_account_pool_route(&mut catalog, 3002, "openrouter-group");
    catalog.add_routing_policy(RoutingPolicy::new(
        1,
        0,
        0,
        "global-management-policy",
        RoutingPolicyScope::Global,
        None,
        Some(101),
    ));
    catalog.add_routing_rule(
        RoutingRule::new(
            102,
            0,
            0,
            101,
            "global-files-rule",
            1,
            r#"{"routeKey":"openai/management/files"}"#,
            "",
        )
        .with_candidate_channels(vec![RouteCandidate::new(3001, 100)]),
    );
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"routeKey":"openai/management/other"}"#,
        "",
        vec![RouteCandidate::new(3002, 100)],
        vec![],
    );

    let selection = ProviderRouteSelector::new(&catalog)
        .select_account_pool(select_account_pool_query("openai/management/files"))
        .unwrap();

    assert_eq!(3001, selection.route.channel_id);
    assert_eq!("openrouter-default", selection.route.provider_code);
    assert_eq!(Some(1), selection.policy_id);
    assert_eq!(Some(102), selection.rule_id);
}

#[test]
fn selector_rejects_account_pool_candidate_without_callable_endpoint() {
    let mut catalog = base_catalog();
    catalog.add_provider_account_pool_route(ProviderAccountPoolRoute::new("openrouter-main", 3001));
    add_group_policy_rule(
        &mut catalog,
        2,
        201,
        202,
        r#"{"routeKey":"openai/management/files"}"#,
        "",
        vec![RouteCandidate::new(3001, 100)],
        vec![],
    );

    let error = ProviderRouteSelector::new(&catalog)
        .select_account_pool(select_account_pool_query("openai/management/files"))
        .unwrap_err();

    assert_eq!(
        ProviderRouteSelectionErrorKind::ProviderRouteUnavailable,
        error.kind()
    );
    assert!(error.to_string().contains("callable account pool"));
}
