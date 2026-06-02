use sdkwork_claw_product::application::{
    ListModelCatalogQuery, ModelCatalogQueryService, PriceAvailability,
};
use sdkwork_claw_product::domain::{
    provider_native_model_id, BillingMeter, DecimalValue, ModelVendor, PriceSide, ProviderAuthType,
    ProviderRetryPolicy, RouteCandidate, RoutingCapability, RoutingFallbackMode,
    RoutingPolicyScope,
};
use sdkwork_claw_product::infrastructure::sql::catalog::{
    PricingCatalogRows, RefreshableSqlPricingCatalog, SqlPricingCatalogSnapshot,
};
use sdkwork_claw_product::infrastructure::sql::rows::{
    AiModelRow, ChannelGroupMetricSnapshotRow, ChannelGroupRow, GatewayAccessPolicyRow,
    GatewayApiKeyRow, ModelMappingRuleRow, ModelPriceRow, ModelProviderRouteRow, ModelVendorRow,
    PricingPlanRow, ProviderChannelRouteRow, QuotaPolicyRow, RoutingPolicyRow, RoutingRuleRow,
};
use sdkwork_claw_product::infrastructure::sql::PricingCatalogSql;
use sdkwork_claw_product::ports::PricingCatalog;

fn ai_model_row(
    model: &str,
    display_name: &str,
    vendor_code: &str,
    capabilities_json: &str,
) -> AiModelRow {
    AiModelRow {
        catalog_key: format!("{vendor_code}/{model}"),
        model: model.to_owned(),
        display_name: display_name.to_owned(),
        vendor_code: vendor_code.to_owned(),
        region_code: "global".to_owned(),
        capabilities_json: capabilities_json.to_owned(),
        description: Some("Fast commercial model.".to_owned()),
        modalities_json: r#"["text","image"]"#.to_owned(),
        input_modalities_json: r#"["text","image"]"#.to_owned(),
        output_modalities_json: r#"["text"]"#.to_owned(),
        api_format: Some("openai_responses".to_owned()),
        capability_intro: Some("Low latency chat and tool calling.".to_owned()),
        limitations_json: r#"["May need verification for facts."]"#.to_owned(),
        supported_languages_json: r#"["English","Chinese"]"#.to_owned(),
        use_cases_json: r#"["Customer support","Data extraction"]"#.to_owned(),
        training_data_cutoff: Some("2025".to_owned()),
        context_tokens: Some(128000),
        max_output_tokens: Some(16384),
        supports_streaming: true,
        supports_tools: true,
        supports_json_schema: true,
        release_stage: Some(1),
        shelf_state: Some(1),
        routing_state: Some(1),
        replacement_model: None,
    }
}

#[test]
fn sql_queries_use_schema_registry_tables_and_never_forbidden_synonyms() {
    let sql = PricingCatalogSql::all_queries().join("\n");

    for required_table in [
        "ai_model_vendor",
        "ai_model",
        "ai_model_pricing",
        "ai_pricing_plan",
        "iam_gateway_api_key",
        "ai_channel_group",
        "ai_channel_group_metric_snapshot",
        "ai_provider",
        "ai_channel",
        "ai_channel_endpoint",
        "ai_channel_model",
        "ai_routing_policy",
        "ai_routing_profile",
        "ai_routing_rule",
    ] {
        assert!(
            sql.contains(required_table),
            "query set must reference schema table {required_table}"
        );
    }

    for forbidden in [
        "ai_gateway_model",
        "gateway_model",
        "ai_pricing_group",
        "claw_",
        "sdkwork_",
        "portal_",
        "console_",
        "router_",
    ] {
        assert!(
            !sql.contains(forbidden),
            "query set must not reference forbidden table/prefix {forbidden}"
        );
    }
}

#[test]
fn provider_native_model_id_strips_only_catalog_vendor_scope() {
    assert_eq!("gpt-5.5", provider_native_model_id("openai/gpt-5.5"));
    assert_eq!(
        "openai/global/gpt-5.5",
        provider_native_model_id("openai/global/gpt-5.5"),
        "legacy vendor/region/model identities must not be normalized into provider-native ids"
    );
    assert_eq!(
        "openrouter/global/anthropic/claude-3-opus",
        provider_native_model_id("openrouter/global/anthropic/claude-3-opus"),
        "relay catalog keys must not accept a region segment in the model identity"
    );
    assert_eq!(
        "anthropic/claude-3-opus",
        provider_native_model_id("openrouter/anthropic/claude-3-opus")
    );
    assert_eq!(
        "anthropic/claude-3-opus",
        provider_native_model_id("anthropic/claude-3-opus"),
        "provider-native slash model ids must not be stripped as catalog keys"
    );
}

#[test]
fn sql_queries_project_stable_codes_instead_of_enum_ordinals() {
    let price_sql = PricingCatalogSql::list_model_prices();
    assert!(price_sql.contains("price_side_code"));
    assert!(price_sql.contains("'official_reference'"));
    assert!(price_sql.contains("'upstream_cost'"));
    assert!(price_sql.contains("'customer_charge'"));
    assert!(price_sql.contains("'internal_transfer'"));

    let plan_sql = PricingCatalogSql::find_pricing_plan();
    assert!(plan_sql.contains("base_price_side_code"));
    assert!(plan_sql.contains("'official_reference'"));
}

#[test]
fn provider_route_queries_use_explicit_region_context_not_catalog_key_segments() {
    let postgres_sql = PricingCatalogSql::load_provider_routes();
    assert!(postgres_sql.contains("AS region_code"));
    assert!(postgres_sql.contains(
        "COALESCE(NULLIF(e.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code"
    ));
    assert!(PricingCatalogSql::load_provider_channel_routes().contains(
        "endpoint.region_code IN (COALESCE(NULLIF(c.region_code, ''), 'global'), 'global')"
    ));
    for forbidden in [
        "strpos(m.catalog_key",
        "substr(m.catalog_key",
        "split_part(m.catalog_key",
    ] {
        assert!(
            !postgres_sql.contains(forbidden),
            "provider route SQL must not derive region from catalog_key with {forbidden}"
        );
    }

    let sqlite_sql = include_str!("../src/infrastructure/sql/sqlite/queries.rs");
    assert!(sqlite_sql.contains("AS region_code"));
    assert!(sqlite_sql.contains(
        "COALESCE(NULLIF(e.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code"
    ));
    assert!(sqlite_sql.contains(
        "endpoint.region_code IN (COALESCE(NULLIF(c.region_code, ''), 'global'), 'global')"
    ));
    for forbidden in ["instr(m.catalog_key", "substr(m.catalog_key"] {
        assert!(
            !sqlite_sql.contains(forbidden),
            "sqlite provider route SQL must not derive region from catalog_key with {forbidden}"
        );
    }
}

#[test]
fn snapshot_load_queries_are_parameterless_and_cover_every_catalog_row_set() {
    let queries = PricingCatalogSql::snapshot_load_queries();
    assert_eq!(14, queries.len());

    let sql = queries.join("\n");
    for required_table in [
        "ai_model_vendor",
        "ai_model",
        "ai_model_pricing",
        "ai_pricing_plan",
        "iam_gateway_api_key",
        "ai_channel_group",
        "ai_channel_group_metric_snapshot",
        "iam_gateway_access_policy",
        "ai_quota_policy",
        "ai_provider",
        "ai_channel",
        "ai_channel_endpoint",
        "ai_channel_model",
        "ai_routing_policy",
        "ai_routing_profile",
        "ai_routing_rule",
        "ai_model_mapping_rule",
    ] {
        assert!(
            sql.contains(required_table),
            "snapshot load queries must reference {required_table}"
        );
    }

    assert!(
        !sql.contains("api_key_id") && !sql.contains("group_id = $"),
        "snapshot load queries must not depend on request-time route selection parameters"
    );
    assert!(
        !sql.contains("gateway_model"),
        "snapshot load queries must use ai_channel_model.model"
    );
    assert!(sql.contains("price_side_code"));
    assert!(sql.contains("base_price_side_code"));
    assert!(
        PricingCatalogSql::load_api_keys().contains("key_hash"),
        "API key snapshot query must load iam_gateway_api_key.key_hash for credential authentication"
    );
    assert!(
        PricingCatalogSql::load_api_keys().contains("channel_group_id"),
        "API key snapshot query must bind gateway keys to ai_channel_group through channel_group_id"
    );
    assert!(
        PricingCatalogSql::load_channel_groups().contains("ai_channel_group"),
        "channel group snapshot query must load reusable AI channel groups"
    );
    assert!(
        PricingCatalogSql::load_channel_group_metric_snapshots()
            .contains("ai_channel_group_metric_snapshot"),
        "channel group metric snapshot query must load AI channel group metric projections"
    );
    assert!(
        PricingCatalogSql::load_channel_groups().contains("NULLIF(BTRIM(pricing_plan_code), '')")
            && PricingCatalogSql::load_channel_groups().contains("'standard'"),
        "channel group snapshot query must default empty pricing_plan_code before runtime billing subject validation"
    );
    assert!(
        PricingCatalogSql::load_api_keys().contains("key_display_masked"),
        "API key snapshot query must load only masked key material for console listing"
    );
    assert!(
        PricingCatalogSql::load_access_policies().contains("allowed_capabilities"),
        "API key snapshot query must load access policy capabilities for route modality rendering"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("base_url"),
        "provider route snapshot query must project resolved provider base_url"
    );
    assert!(
        !PricingCatalogSql::load_provider_routes().contains("ai_route_candidate"),
        "provider route snapshot query must not read the precomputed route candidate projection"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("ai_channel_endpoint"),
        "provider route snapshot query must join region-aware channel endpoints"
    );
    assert!(
        PricingCatalogSql::load_provider_routes()
            .contains("COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url)"),
        "provider route snapshot query must prefer endpoint base_url before channel/provider fallback"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("e.region_code")
            && PricingCatalogSql::load_provider_routes().contains("'global'"),
        "provider route snapshot query must preserve explicit endpoint/channel route region with global fallback"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("LEFT JOIN ai_provider p"),
        "provider route snapshot query must allow channel-owned base_url routes when provider registry metadata is absent"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("JOIN ai_channel c"),
        "provider route snapshot query must require an active channel for callable routing"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("FROM ai_channel_model cm"),
        "provider route snapshot query must drive model-scoped routing from channel model support"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("secret_ref"),
        "provider route snapshot query must project channel credential_ref as secret_ref"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("auth_type"),
        "provider route snapshot query must project channel auth_type"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("auth_config"),
        "provider route snapshot query must project channel auth_config"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("NULLIF(c.credential_ref, '')"),
        "provider route snapshot query must filter routes without channel credential_ref"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("p.id IS NULL OR p.status = 1"),
        "provider route snapshot query must still exclude disabled provider metadata when it exists"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains(
            "NULLIF(COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url), '')"
        ),
        "provider route snapshot query must filter routes without resolved base_url"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("timeout_ms"),
        "provider route snapshot query must project ai_channel.timeout_ms for provider egress timeout control"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("retry_policy"),
        "provider route snapshot query must project ai_channel.retry_policy for provider egress retry control"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("COALESCE(c.health_status, 1) = 1")
            && PricingCatalogSql::load_provider_routes()
                .contains("$1 * INTERVAL '1 second'"),
        "provider route snapshot query must filter circuit-broken channels until the recovery probe window opens"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("base_url"),
        "channel group snapshot query must project resolved provider base_url for model-less route-scoped forwarding"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("ai_channel_endpoint"),
        "channel group snapshot query must join channel endpoints for region-aware forwarding"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes()
            .contains("COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url)"),
        "channel group snapshot query must prefer endpoint base_url before channel/provider fallback"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes()
            .contains("COALESCE(NULLIF(e.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code"),
        "channel group snapshot query must project explicit route region context for pricing and usage"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes()
            .contains("LEFT JOIN ai_provider p"),
        "channel group snapshot query must allow channel-owned base_url routes when provider registry metadata is absent"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("FROM ai_channel c"),
        "channel group snapshot query must read active AI channels for callable forwarding"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("ai_channel_group_member"),
        "channel group snapshot query must derive group membership from ai_channel_group_member"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("ai_channel_group_resource"),
        "channel group snapshot query must derive group resource scope from ai_channel_group_resource"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("ai_channel_resource"),
        "channel group snapshot query must derive channel resource scope from ai_channel_resource"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("ai_resource_group_item"),
        "channel group snapshot query must expand resource group members when building routing scopes"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("apiScope"),
        "channel group snapshot query must include API scope separately from modality capability scope"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("matched_resource_scope"),
        "channel group snapshot query must route from the intersection of channel and group resource scopes"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("resource_group_tree")
            && PricingCatalogSql::load_provider_channel_routes().contains("resource_group_leaf")
            && PricingCatalogSql::load_provider_channel_routes()
                .contains("child_resource_group_code"),
        "channel group snapshot query must recursively expand reusable resource groups"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("r.vendor_code")
            && PricingCatalogSql::load_provider_channel_routes()
                .contains("gr.vendor_code = cr.vendor_code")
            && PricingCatalogSql::load_provider_channel_routes()
                .contains("gr.resource_type = 'vendor' OR cr.resource_type = 'vendor'"),
        "channel group snapshot query must allow vendor resources to intersect with more specific vendor-owned resources"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes()
            .contains("gr.resource_type = 'api_endpoint' OR cr.resource_type = 'api_endpoint'")
            && PricingCatalogSql::load_provider_channel_routes()
                .contains("gr.resource_type = 'modality' OR cr.resource_type = 'modality'"),
        "channel group snapshot query must not match distinct model resources only by shared API or modality"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("'__deny__'"),
        "channel group snapshot query must deny routes when channel/group resources do not overlap"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("COALESCE(b.enabled, true)")
            && PricingCatalogSql::load_provider_channel_routes()
                .contains("COALESCE(member.enabled, true)"),
        "channel group snapshot query must exclude disabled group-channel bindings"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("endpoint.timeout_ms")
            && PricingCatalogSql::load_provider_channel_routes().contains("endpoint.retry_policy"),
        "channel group snapshot query must project endpoint timeout and retry policy through the lateral endpoint selection"
    );
    assert!(
        !PricingCatalogSql::load_provider_channel_routes().contains("FROM ai_route_candidate b"),
        "channel group snapshot query must not derive resource authorization from route candidate projections"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("secret_ref"),
        "channel group snapshot query must project channel credential_ref as secret_ref"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("auth_type"),
        "channel group snapshot query must project channel auth_type"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("auth_config"),
        "channel group snapshot query must project channel auth_config"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("NULLIF(c.credential_ref, '')"),
        "channel group snapshot query must filter channels without channel credential_ref"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("p.id IS NULL OR p.status = 1"),
        "channel route snapshot query must still exclude disabled provider metadata when it exists"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains(
            "NULLIF(COALESCE(NULLIF(e.base_url, ''), NULLIF(c.base_url, ''), p.base_url), '')"
        ),
        "channel route snapshot query must filter channels without resolved base_url"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes()
            .contains("COALESCE(c.health_status, 1) = 1")
            && PricingCatalogSql::load_provider_channel_routes()
                .contains("$1 * INTERVAL '1 second'"),
        "channel route snapshot query must filter circuit-broken channels until the recovery probe window opens"
    );
    assert!(
        PricingCatalogSql::load_provider_channel_routes().contains("modelScope")
            && PricingCatalogSql::load_provider_channel_routes().contains("capabilities"),
        "channel route snapshot query must include group binding model and capability scopes"
    );
    assert!(
        PricingCatalogSql::load_routing_policies().contains("default_profile_id"),
        "routing policy snapshot query must project the default active profile"
    );
    assert!(
        PricingCatalogSql::load_routing_rules().contains("candidate_channels"),
        "routing rule snapshot query must project candidate account-pool channels"
    );
    assert!(
        PricingCatalogSql::load_routing_rules().contains("fallback_chain"),
        "routing rule snapshot query must project configured fallback account-pool channels"
    );
}

#[test]
fn provider_route_snapshot_derives_model_routes_from_normalized_channel_facts() {
    let sql = PricingCatalogSql::load_provider_routes();

    assert!(
        !sql.contains("ai_route_candidate"),
        "provider route snapshot must not depend on the precomputed route candidate projection; it would grow as channel_group x api x model data"
    );
    for required_table in [
        "ai_channel_model",
        "ai_channel_endpoint",
        "ai_channel",
        "ai_provider",
    ] {
        assert!(
            sql.contains(required_table),
            "provider route snapshot must derive callable model routes from normalized table {required_table}"
        );
    }
    assert!(
        sql.contains("cm.catalog_key AS catalog_key")
            && sql.contains("COALESCE(NULLIF(e.region_code, ''), NULLIF(c.region_code, ''), 'global') AS region_code"),
        "provider route snapshot must keep model identity region-free and resolve region only from endpoint/channel context"
    );
}

#[test]
fn row_mappers_convert_sql_rows_into_domain_objects() {
    let vendor = ModelVendorRow {
        vendor_code: "openai".to_owned(),
        display_name: "OpenAI".to_owned(),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(ModelVendor::OpenAi, vendor.vendor);

    let model = ai_model_row(
        "gpt-4o-mini",
        "GPT-4o mini",
        "openai",
        r#"["chat","tools","json_schema"]"#,
    )
    .try_into_domain()
    .unwrap();
    assert_eq!(vec!["chat", "tools", "json_schema"], model.capabilities);
    assert_eq!(Some("Fast commercial model."), model.description.as_deref());
    assert_eq!(vec!["text", "image"], model.modalities);
    assert_eq!(Some("openai_responses"), model.api_format.as_deref());
    assert_eq!(Some(128000), model.context_tokens);

    let route = ModelProviderRouteRow {
        catalog_key: "openai/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        api_code: Some("openai.chat_completions".to_owned()),
        region_code: "global".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "gpt-4o-mini".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
        auth_type: Some("bearer".to_owned()),
        auth_config_json: Some("{}".to_owned()),
        timeout_ms: Some(30_000),
        retry_policy_json: Some(
            r#"{"max_attempts":3,"retryable_status_codes":[429,500,503],"backoff_ms":25}"#
                .to_owned(),
        ),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!("openrouter", route.provider_code);
    assert_eq!(
        Some("http://provider-proxy.internal/openrouter"),
        route.base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/main"),
        route.secret_ref.as_deref()
    );
    assert_eq!(Some(30_000), route.timeout_ms);
    assert_eq!(
        Some(ProviderRetryPolicy::new(3, vec![429, 500, 503], 25).unwrap()),
        route.retry_policy
    );
    assert_eq!(ProviderAuthType::Bearer, route.auth_profile.auth_type);
    assert_eq!(None, route.auth_profile.name);

    let channel_route = ProviderChannelRouteRow {
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        region_code: "cn".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
        auth_type: Some("header".to_owned()),
        auth_config_json: Some(r#"{"name":"x-api-key"}"#.to_owned()),
        timeout_ms: Some(30_000),
        retry_policy_json: Some(
            r#"{"max_attempts":3,"retryable_status_codes":[429,500,503],"backoff_ms":25}"#
                .to_owned(),
        ),
        group_bindings_json: r#"[{"groupId":10,"priority":7,"weight":80,"modelScope":["openai/gpt-4o-mini"],"apiScope":["openai.chat_completions"],"capabilities":["llm"]}]"#.to_owned(),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!("openrouter", channel_route.provider_code);
    assert_eq!(3001, channel_route.channel_id);
    assert_eq!("cn", channel_route.region_code);
    assert_eq!(
        Some("http://provider-proxy.internal/openrouter"),
        channel_route.base_url.as_deref()
    );
    assert_eq!(
        Some("vault://providers/openrouter/account/main"),
        channel_route.secret_ref.as_deref()
    );
    assert_eq!(Some(30_000), channel_route.timeout_ms);
    assert_eq!(
        Some(ProviderRetryPolicy::new(3, vec![429, 500, 503], 25).unwrap()),
        channel_route.retry_policy
    );
    assert_eq!(
        ProviderAuthType::Header,
        channel_route.auth_profile.auth_type
    );
    assert_eq!(
        Some("x-api-key"),
        channel_route.auth_profile.name.as_deref()
    );
    assert_eq!(1, channel_route.group_bindings.len());
    assert_eq!(10, channel_route.group_bindings[0].group_id);
    assert_eq!(7, channel_route.group_bindings[0].priority);
    assert_eq!(80, channel_route.group_bindings[0].weight);
    assert_eq!(
        vec!["openai/gpt-4o-mini".to_owned()],
        channel_route.group_bindings[0].model_scope
    );
    assert_eq!(
        vec!["openai.chat_completions".to_owned()],
        channel_route.group_bindings[0].api_scope
    );
    assert_eq!(
        vec!["llm".to_owned()],
        channel_route.group_bindings[0].capabilities
    );

    let api_key = GatewayApiKeyRow {
        id: 100,
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        group_id: 10,
        name: "Production Key".to_owned(),
        key_prefix: "sk-test".to_owned(),
        key_display_masked: "sk-test********ABCD".to_owned(),
        key_hash: "hash:sk-test".to_owned(),
        copyable_key: Some("sk-test-secret".to_owned()),
        policy_id: Some(700),
        quota_policy_id: Some(900),
        created_at: "2026-04-10 20:55:41".to_owned(),
        expire_at: Some("2027-01-01 00:00:00".to_owned()),
        status_code: 1,
        default_for_runtime: false,
    }
    .into_domain();
    assert_eq!(10, api_key.group_id);
    assert_eq!("hash:sk-test", api_key.key_hash);
    assert_eq!("Production Key", api_key.name);
    assert_eq!("sk-test********ABCD", api_key.key_display_masked);

    let access_policy = GatewayAccessPolicyRow {
        id: 700,
        allowed_capabilities_json: r#"["text","image"]"#.to_owned(),
        ip_allowlist_json: r#"["192.168.1.1","10.0.0.0/24"]"#.to_owned(),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(vec!["text", "image"], access_policy.allowed_capabilities);

    let quota_policy = QuotaPolicyRow {
        id: 900,
        quota_limit: Some("1000.000000".to_owned()),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(
        "1000.000000",
        quota_policy.quota_limit.unwrap().to_fixed_string(6)
    );

    let metric_snapshot = ChannelGroupMetricSnapshotRow {
        group_id: 10,
        capacity_used: Some("37.500000".to_owned()),
        capacity_limit: Some("1000.000000".to_owned()),
        usage_amount_total: Some("37.500000".to_owned()),
        snapshot_at: Some("2026-04-29 00:00:00".to_owned()),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(
        "37.500000",
        metric_snapshot
            .usage_amount_total
            .unwrap()
            .to_fixed_string(6)
    );

    let group = ChannelGroupRow {
        id: 10,
        tenant_id: 10,
        organization_id: 20,
        name: "Standard Group".to_owned(),
        code: "standard-group".to_owned(),
        pricing_plan_code: "standard".to_owned(),
        rate_multiplier: "1.200000".to_owned(),
        official_price_multiplier: "1.100000".to_owned(),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(
        DecimalValue::parse("1.100000").unwrap(),
        group.official_price_multiplier
    );

    let plan = PricingPlanRow {
        plan_code: "standard".to_owned(),
        base_price_side_code: "official_reference".to_owned(),
        default_multiplier: "1.300000".to_owned(),
        default_markup_amount: "0.020000".to_owned(),
        currency: "USD".to_owned(),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(PriceSide::OfficialReference, plan.base_price_side);

    let price = ModelPriceRow {
        catalog_key: "openai/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        region_code: "global".to_owned(),
        price_side_code: "upstream_cost".to_owned(),
        billing_meter_code: "llm_input_token".to_owned(),
        unit_price: "0.110000".to_owned(),
        currency: "USD".to_owned(),
        provider_code: Some("openrouter".to_owned()),
        channel_id: Some(3001),
        pricing_plan_code: None,
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(PriceSide::UpstreamCost, price.price_side);
    assert_eq!(BillingMeter::LlmInputToken, price.billing_meter);
    assert_eq!("global", price.region_code);
    assert_eq!("0.110000", price.unit_price.to_fixed_string(6));

    let routing_policy = RoutingPolicyRow {
        id: 9001,
        tenant_id: 10,
        organization_id: 20,
        policy_code: "standard-group-routing".to_owned(),
        policy_scope: 5,
        subject_id: Some(10),
        capability: Some(1),
        default_profile_id: Some(9101),
        fallback_mode: Some(1),
    }
    .try_into_domain()
    .unwrap();
    assert_eq!(
        RoutingPolicyScope::ChannelGroup,
        routing_policy.policy_scope
    );
    assert_eq!(Some(RoutingCapability::Chat), routing_policy.capability);
    assert_eq!(
        Some(RoutingFallbackMode::None),
        routing_policy.fallback_mode
    );
    assert_eq!(Some(10), routing_policy.subject_id);
    assert_eq!(Some(9101), routing_policy.default_profile_id);

    let routing_rule = RoutingRuleRow {
        id: 9102,
        tenant_id: 10,
        organization_id: 20,
        profile_id: 9101,
        rule_code: "gpt-4o-mini-account-pool".to_owned(),
        priority: 10,
        match_expression_json: r#"{"catalogKey":"openai/gpt-4o-mini"}"#.to_owned(),
        target_model: Some("openai/gpt-4o-mini".to_owned()),
        candidate_channels_json: r#"[{"channel_id":3001,"weight":100}]"#.to_owned(),
        fallback_chain_json: r#"[{"channelId":3002,"weight":50}]"#.to_owned(),
        constraints_json: r#"{"max_latency_ms":30000}"#.to_owned(),
    }
    .try_into_domain()
    .unwrap();
    assert!(routing_rule.matches_catalog_key("openai/gpt-4o-mini", "gpt-4o-mini"));
    assert_eq!(
        vec![RouteCandidate::new(3001, 100)],
        routing_rule.candidate_channels
    );
    assert_eq!(
        vec![RouteCandidate::new(3002, 50)],
        routing_rule.fallback_chain
    );
}

#[test]
fn row_mappers_reject_invalid_decimal_and_unknown_price_side() {
    let invalid_group = ChannelGroupRow {
        id: 10,
        tenant_id: 10,
        organization_id: 20,
        name: "Standard Group".to_owned(),
        code: "standard-group".to_owned(),
        pricing_plan_code: "standard".to_owned(),
        rate_multiplier: "not-a-decimal".to_owned(),
        official_price_multiplier: "1.000000".to_owned(),
    };
    assert!(invalid_group.try_into_domain().is_err());

    let invalid_price = ModelPriceRow {
        catalog_key: "openai/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        region_code: "global".to_owned(),
        price_side_code: "wrong_side".to_owned(),
        billing_meter_code: "llm_input_token".to_owned(),
        unit_price: "0.110000".to_owned(),
        currency: "USD".to_owned(),
        provider_code: None,
        channel_id: None,
        pricing_plan_code: None,
    };
    assert!(invalid_price.try_into_domain().is_err());

    let invalid_timeout = ModelProviderRouteRow {
        catalog_key: "openai/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        api_code: Some("openai.chat_completions".to_owned()),
        region_code: "global".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "gpt-4o-mini".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
        auth_type: None,
        auth_config_json: None,
        timeout_ms: Some(0),
        retry_policy_json: None,
    };
    let error = invalid_timeout.try_into_domain().unwrap_err();
    assert!(error.to_string().contains("timeout_ms must be positive"));

    let invalid_retry_policy = ModelProviderRouteRow {
        catalog_key: "openai/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        api_code: Some("openai.chat_completions".to_owned()),
        region_code: "global".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "gpt-4o-mini".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
        auth_type: None,
        auth_config_json: None,
        timeout_ms: Some(30_000),
        retry_policy_json: Some(r#"{"max_attempts":0,"retryable_status_codes":[503]}"#.to_owned()),
    };
    let error = invalid_retry_policy.try_into_domain().unwrap_err();
    assert!(error.to_string().contains("ai_channel.retry_policy"));
}

#[test]
fn model_provider_route_row_normalizes_catalog_key_provider_model_to_native_model() {
    let route = ModelProviderRouteRow {
        catalog_key: "openai/gpt-5.5".to_owned(),
        model: "gpt-5.5".to_owned(),
        api_code: Some("openai.chat_completions".to_owned()),
        region_code: "global".to_owned(),
        provider_code: "openai".to_owned(),
        channel_id: 3001,
        provider_model: "openai/gpt-5.5".to_owned(),
        base_url: Some("http://provider-proxy.internal/openai".to_owned()),
        secret_ref: Some("vault://providers/openai/account/main".to_owned()),
        auth_type: Some("bearer".to_owned()),
        auth_config_json: Some("{}".to_owned()),
        timeout_ms: None,
        retry_policy_json: None,
    }
    .try_into_domain()
    .unwrap();

    assert_eq!(
        "gpt-5.5", route.provider_model,
        "default channel model mappings must send provider-native model ids upstream"
    );
}

#[test]
fn model_provider_route_row_normalizes_slash_catalog_provider_model_to_native_model() {
    let route = ModelProviderRouteRow {
        catalog_key: "openrouter/anthropic/claude-3-opus".to_owned(),
        model: "anthropic/claude-3-opus".to_owned(),
        api_code: Some("openai.chat_completions".to_owned()),
        region_code: "global".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "openrouter/anthropic/claude-3-opus".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
        auth_type: Some("bearer".to_owned()),
        auth_config_json: Some("{}".to_owned()),
        timeout_ms: None,
        retry_policy_json: None,
    }
    .try_into_domain()
    .unwrap();

    assert_eq!(
        "anthropic/claude-3-opus", route.provider_model,
        "catalog keys with slash-containing provider-native ids must drop only vendor before relay"
    );
}

#[test]
fn sql_catalog_snapshot_implements_pricing_catalog_from_database_rows() {
    let snapshot = SqlPricingCatalogSnapshot::from_rows(priced_catalog_rows()).unwrap();
    let api_key = snapshot.find_api_key_by_hash("hash:sk-test").unwrap();
    assert_eq!(100, api_key.id);
    let service = ModelCatalogQueryService::new(&snapshot);

    let page = service
        .list_models(ListModelCatalogQuery {
            api_key_id: Some(100),
            billing_meter: BillingMeter::LlmInputToken,
            vendor_code: Some("openai".to_owned()),
            vendor_codes: Vec::new(),
            modalities: Vec::new(),
            capabilities: Vec::new(),
            categories: Vec::new(),
            groups: Vec::new(),
            search_query: None,
            limit: None,
        })
        .unwrap();

    assert_eq!(1, page.items.len());
    let item = &page.items[0];
    assert_eq!("gpt-4o-mini", item.model);
    assert_eq!(vec!["azure_openai", "openrouter"], item.provider_codes);
    assert_eq!(
        "0.110000",
        item.lowest_upstream_cost_unit_price.as_deref().unwrap()
    );

    match &item.price_availability {
        PriceAvailability::Available(price) => {
            assert_eq!("standard-group", price.group_code);
            assert_eq!("standard", price.pricing_plan_code);
            assert_eq!("0.198000", price.customer_unit_price);
            assert_eq!("0.088000", price.gross_margin_per_unit.as_deref().unwrap());
        }
        PriceAvailability::Unavailable { reason } => {
            panic!("snapshot must preserve pricing rows: {reason}");
        }
    }

    let policies = snapshot.list_routing_policies();
    assert_eq!(1, policies.len());
    assert_eq!(RoutingPolicyScope::ChannelGroup, policies[0].policy_scope);
    assert_eq!(Some(10), policies[0].subject_id);

    let rules = snapshot.list_routing_rules(9101);
    assert_eq!(1, rules.len());
    assert_eq!(
        vec![RouteCandidate::new(3001, 100)],
        rules[0].candidate_channels
    );

    let channel_routes = snapshot.list_provider_channel_routes();
    assert_eq!(2, channel_routes.len());
    assert_eq!(3001, channel_routes[0].channel_id);
    assert_eq!(
        Some("vault://providers/openrouter/account/main"),
        channel_routes[0].secret_ref.as_deref()
    );
}

#[test]
fn sql_catalog_snapshot_rejects_legacy_regional_route_identity() {
    let mut rows = priced_catalog_rows();
    rows.provider_routes.push(ModelProviderRouteRow {
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        api_code: Some("openai.chat_completions".to_owned()),
        region_code: "global".to_owned(),
        provider_code: "legacy-region-route".to_owned(),
        channel_id: 4001,
        provider_model: "gpt-4o-mini".to_owned(),
        base_url: Some("http://provider-proxy.internal/legacy-region-route".to_owned()),
        secret_ref: Some("vault://providers/legacy-region-route/account/main".to_owned()),
        auth_type: Some("bearer".to_owned()),
        auth_config_json: Some("{}".to_owned()),
        timeout_ms: None,
        retry_policy_json: None,
    });

    let error = match SqlPricingCatalogSnapshot::from_rows(rows) {
        Ok(_) => panic!("catalog snapshot must reject legacy regional route identity"),
        Err(error) => error,
    };
    assert!(
        error
            .to_string()
            .contains("ai_channel_model.catalog_key must use vendor/model identity"),
        "{error}"
    );
}

#[test]
fn sql_catalog_snapshot_uses_base_model_identity_and_region_scoped_prices() {
    let snapshot = SqlPricingCatalogSnapshot::from_rows(priced_catalog_rows()).unwrap();

    assert!(snapshot.find_model("openai/global/gpt-4o-mini").is_none());
    assert!(snapshot
        .list_provider_routes("openai/global/gpt-4o-mini")
        .is_empty());
    let price = snapshot
        .find_model_price(
            "openai/gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::LlmInputToken,
            None,
            None,
        )
        .expect(
            "base vendor/model catalog keys must resolve price rows through explicit region_code",
        );
    assert_eq!("openai/gpt-4o-mini", price.catalog_key);
    assert_eq!("global", price.region_code);

    assert!(
        snapshot
            .find_model_price(
                "openai/global/gpt-4o-mini",
                PriceSide::OfficialReference,
                BillingMeter::LlmInputToken,
                None,
                None,
            )
            .is_none(),
        "legacy vendor/region/model price identities must not be accepted"
    );
}

#[test]
fn sql_catalog_snapshot_rejects_invalid_rows_before_serving_catalog() {
    let mut rows = priced_catalog_rows();
    rows.prices.push(ModelPriceRow {
        catalog_key: "openai/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        region_code: "global".to_owned(),
        price_side_code: "customer_charge".to_owned(),
        billing_meter_code: "llm_input_token".to_owned(),
        unit_price: "invalid-decimal".to_owned(),
        currency: "USD".to_owned(),
        provider_code: None,
        channel_id: None,
        pricing_plan_code: Some("standard".to_owned()),
    });

    let result = SqlPricingCatalogSnapshot::from_rows(rows);

    assert!(result.is_err());
}

#[test]
fn refreshable_sql_catalog_serves_replaced_snapshot_without_rebuilding_runtime_routes() {
    let initial_snapshot = SqlPricingCatalogSnapshot::from_rows(priced_catalog_rows()).unwrap();
    let catalog = RefreshableSqlPricingCatalog::new(initial_snapshot);

    let initial_routes = catalog.list_provider_routes("openai/gpt-4o-mini");
    assert_eq!(2, initial_routes.len());
    assert!(initial_routes
        .iter()
        .any(|route| route.provider_code == "openrouter"));

    let mut refreshed_rows = priced_catalog_rows();
    refreshed_rows
        .provider_routes
        .retain(|route| route.provider_code != "openrouter");
    refreshed_rows
        .provider_channel_routes
        .retain(|route| route.provider_code != "openrouter");
    let refreshed_snapshot = SqlPricingCatalogSnapshot::from_rows(refreshed_rows).unwrap();

    catalog.replace_snapshot(refreshed_snapshot);

    let refreshed_routes = catalog.list_provider_routes("openai/gpt-4o-mini");
    assert_eq!(1, refreshed_routes.len());
    assert_eq!("azure_openai", refreshed_routes[0].provider_code);
    let channel_routes = catalog.list_provider_channel_routes();
    assert_eq!(1, channel_routes.len());
    assert_eq!("azure_openai", channel_routes[0].provider_code);
}

#[test]
fn sql_catalog_snapshot_rejects_invalid_provider_timeout_before_serving_catalog() {
    let mut rows = priced_catalog_rows();
    rows.provider_routes[0].timeout_ms = Some(-1);

    let result = SqlPricingCatalogSnapshot::from_rows(rows);

    let error = match result {
        Ok(_) => panic!("catalog snapshot must reject invalid provider timeout"),
        Err(error) => error,
    };
    assert!(error.to_string().contains("timeout_ms must be positive"));
}

#[test]
fn sql_catalog_snapshot_rejects_invalid_provider_retry_policy_before_serving_catalog() {
    let mut rows = priced_catalog_rows();
    rows.provider_routes[0].retry_policy_json =
        Some(r#"{"max_attempts":3,"retryable_status_codes":[503],"unexpected":true}"#.to_owned());

    let result = SqlPricingCatalogSnapshot::from_rows(rows);

    let error = match result {
        Ok(_) => panic!("catalog snapshot must reject invalid provider retry policy"),
        Err(error) => error,
    };
    assert!(error.to_string().contains("ai_channel.retry_policy"));
}

#[test]
fn sql_catalog_snapshot_rejects_invalid_routing_rule_json_before_serving_catalog() {
    let mut rows = priced_catalog_rows();
    rows.routing_rules[0].candidate_channels_json = "not-json".to_owned();

    let result = SqlPricingCatalogSnapshot::from_rows(rows);

    let error = match result {
        Ok(_) => panic!("catalog snapshot must reject invalid routing candidate channels"),
        Err(error) => error,
    };
    assert!(error.to_string().contains("candidate_channels"));
}

#[test]
fn sql_catalog_snapshot_rejects_unknown_routing_fallback_mode_before_serving_catalog() {
    let mut rows = priced_catalog_rows();
    rows.routing_policies[0].fallback_mode = Some(99);

    let result = SqlPricingCatalogSnapshot::from_rows(rows);

    let error = match result {
        Ok(_) => panic!("catalog snapshot must reject unknown routing fallback modes"),
        Err(error) => error,
    };
    assert!(error.to_string().contains("fallback_mode"));
}

#[test]
fn sql_catalog_snapshot_rejects_unknown_routing_capability_before_serving_catalog() {
    let mut rows = priced_catalog_rows();
    rows.routing_policies[0].capability = Some(99);

    let result = SqlPricingCatalogSnapshot::from_rows(rows);

    let error = match result {
        Ok(_) => panic!("catalog snapshot must reject unknown routing capabilities"),
        Err(error) => error,
    };
    assert!(error.to_string().contains("capability"));
}

fn priced_catalog_rows() -> PricingCatalogRows {
    PricingCatalogRows {
        vendors: vec![ModelVendorRow {
            vendor_code: "openai".to_owned(),
            display_name: "OpenAI".to_owned(),
        }],
        models: vec![ai_model_row(
            "gpt-4o-mini",
            "GPT-4o mini",
            "openai",
            r#"["chat","tools","json_schema"]"#,
        )],
        provider_routes: vec![
            ModelProviderRouteRow {
                catalog_key: "openai/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                api_code: Some("openai.chat_completions".to_owned()),
                region_code: "global".to_owned(),
                provider_code: "openrouter".to_owned(),
                channel_id: 3001,
                provider_model: "gpt-4o-mini".to_owned(),
                base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
                secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
                auth_type: Some("bearer".to_owned()),
                auth_config_json: Some("{}".to_owned()),
                timeout_ms: Some(30_000),
                retry_policy_json: Some(
                    r#"{"max_attempts":3,"retryable_status_codes":[429,500,503],"backoff_ms":25}"#
                        .to_owned(),
                ),
            },
            ModelProviderRouteRow {
                catalog_key: "openai/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                api_code: Some("openai.chat_completions".to_owned()),
                region_code: "global".to_owned(),
                provider_code: "azure_openai".to_owned(),
                channel_id: 2001,
                provider_model: "gpt-4o-mini".to_owned(),
                base_url: Some("http://provider-proxy.internal/azure".to_owned()),
                secret_ref: Some("vault://providers/azure/account/main".to_owned()),
                auth_type: Some("azure_openai".to_owned()),
                auth_config_json: Some("{}".to_owned()),
                timeout_ms: None,
                retry_policy_json: None,
            },
        ],
        provider_channel_routes: vec![
            ProviderChannelRouteRow {
                provider_code: "openrouter".to_owned(),
                channel_id: 3001,
                region_code: "global".to_owned(),
                base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
                secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
                auth_type: Some("bearer".to_owned()),
                auth_config_json: Some("{}".to_owned()),
                timeout_ms: Some(30_000),
                retry_policy_json: Some(
                    r#"{"max_attempts":3,"retryable_status_codes":[429,500,503],"backoff_ms":25}"#
                        .to_owned(),
                ),
                group_bindings_json: "[]".to_owned(),
            },
            ProviderChannelRouteRow {
                provider_code: "azure_openai".to_owned(),
                channel_id: 2001,
                region_code: "global".to_owned(),
                base_url: Some("http://provider-proxy.internal/azure".to_owned()),
                secret_ref: Some("vault://providers/azure/account/main".to_owned()),
                auth_type: Some("azure_openai".to_owned()),
                auth_config_json: Some("{}".to_owned()),
                timeout_ms: None,
                retry_policy_json: None,
                group_bindings_json: "[]".to_owned(),
            },
        ],
        routing_policies: vec![RoutingPolicyRow {
            id: 9001,
            tenant_id: 10,
            organization_id: 20,
            policy_code: "standard-group-routing".to_owned(),
            policy_scope: 5,
            subject_id: Some(10),
            capability: Some(1),
            default_profile_id: Some(9101),
            fallback_mode: Some(1),
        }],
        routing_rules: vec![RoutingRuleRow {
            id: 9102,
            tenant_id: 10,
            organization_id: 20,
            profile_id: 9101,
            rule_code: "gpt-4o-mini-account-pool".to_owned(),
            priority: 10,
            match_expression_json: r#"{"catalogKey":"openai/gpt-4o-mini"}"#.to_owned(),
            target_model: Some("openai/gpt-4o-mini".to_owned()),
            candidate_channels_json: r#"[{"channel_id":3001,"weight":100}]"#.to_owned(),
            fallback_chain_json: "[]".to_owned(),
            constraints_json: "{}".to_owned(),
        }],
        model_mappings: Vec::<ModelMappingRuleRow>::new(),
        pricing_plans: vec![PricingPlanRow {
            plan_code: "standard".to_owned(),
            base_price_side_code: "official_reference".to_owned(),
            default_multiplier: "1.200000".to_owned(),
            default_markup_amount: "0.000000".to_owned(),
            currency: "USD".to_owned(),
        }],
        channel_groups: vec![ChannelGroupRow {
            id: 10,
            tenant_id: 10,
            organization_id: 20,
            name: "Standard Group".to_owned(),
            code: "standard-group".to_owned(),
            pricing_plan_code: "standard".to_owned(),
            rate_multiplier: "1.000000".to_owned(),
            official_price_multiplier: "1.100000".to_owned(),
        }],
        api_keys: vec![GatewayApiKeyRow {
            id: 100,
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
            group_id: 10,
            name: "Production Key".to_owned(),
            key_prefix: "sk-test".to_owned(),
            key_display_masked: "sk-test********ABCD".to_owned(),
            key_hash: "hash:sk-test".to_owned(),
            copyable_key: Some("sk-test-secret".to_owned()),
            policy_id: Some(700),
            quota_policy_id: Some(900),
            created_at: "2026-04-10 20:55:41".to_owned(),
            expire_at: Some("2027-01-01 00:00:00".to_owned()),
            status_code: 1,
            default_for_runtime: false,
        }],
        access_policies: vec![GatewayAccessPolicyRow {
            id: 700,
            allowed_capabilities_json: r#"["text","image"]"#.to_owned(),
            ip_allowlist_json: r#"["192.168.1.1","10.0.0.0/24"]"#.to_owned(),
        }],
        quota_policies: vec![QuotaPolicyRow {
            id: 900,
            quota_limit: Some("1000.000000".to_owned()),
        }],
        channel_group_metric_snapshots: vec![ChannelGroupMetricSnapshotRow {
            group_id: 10,
            capacity_used: Some("37.500000".to_owned()),
            capacity_limit: Some("1000.000000".to_owned()),
            usage_amount_total: Some("37.500000".to_owned()),
            snapshot_at: Some("2026-04-29 00:00:00".to_owned()),
        }],
        prices: vec![
            ModelPriceRow {
                catalog_key: "openai/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                region_code: "global".to_owned(),
                price_side_code: "official_reference".to_owned(),
                billing_meter_code: "llm_input_token".to_owned(),
                unit_price: "0.150000".to_owned(),
                currency: "USD".to_owned(),
                provider_code: None,
                channel_id: None,
                pricing_plan_code: None,
            },
            ModelPriceRow {
                catalog_key: "openai/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                region_code: "global".to_owned(),
                price_side_code: "upstream_cost".to_owned(),
                billing_meter_code: "llm_input_token".to_owned(),
                unit_price: "0.110000".to_owned(),
                currency: "USD".to_owned(),
                provider_code: Some("openrouter".to_owned()),
                channel_id: Some(3001),
                pricing_plan_code: None,
            },
            ModelPriceRow {
                catalog_key: "openai/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                region_code: "global".to_owned(),
                price_side_code: "upstream_cost".to_owned(),
                billing_meter_code: "llm_input_token".to_owned(),
                unit_price: "0.120000".to_owned(),
                currency: "USD".to_owned(),
                provider_code: Some("azure_openai".to_owned()),
                channel_id: Some(2001),
                pricing_plan_code: None,
            },
        ],
    }
}
