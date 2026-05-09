use sdkwork_claw_product::application::{
    ListModelCatalogQuery, ModelCatalogQueryService, PriceAvailability,
};
use sdkwork_claw_product::domain::{
    BillingMeter, DecimalValue, ModelVendor, PriceSide, ProviderRetryPolicy,
};
use sdkwork_claw_product::infrastructure::sql::catalog::{
    PricingCatalogRows, SqlPricingCatalogSnapshot,
};
use sdkwork_claw_product::infrastructure::sql::rows::{
    AiModelRow, ApiKeyGroupMetricSnapshotRow, ApiKeyGroupRow, GatewayAccessPolicyRow,
    GatewayApiKeyRow, ModelPriceRow, ModelProviderRouteRow, ModelVendorRow, PricingPlanRow,
    QuotaPolicyRow,
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
        catalog_key: format!("{vendor_code}/global/{model}"),
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
        "iam_gateway_api_key_group",
        "integration_provider",
        "integration_provider_account",
        "integration_channel",
        "integration_channel_model",
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
fn snapshot_load_queries_are_parameterless_and_cover_every_catalog_row_set() {
    let queries = PricingCatalogSql::snapshot_load_queries();
    assert_eq!(10, queries.len());

    let sql = queries.join("\n");
    for required_table in [
        "ai_model_vendor",
        "ai_model",
        "ai_model_pricing",
        "ai_pricing_plan",
        "iam_gateway_api_key",
        "iam_gateway_api_key_group",
        "iam_gateway_api_key_group_metric_snapshot",
        "iam_gateway_access_policy",
        "ai_quota_policy",
        "integration_provider",
        "integration_provider_account",
        "integration_channel",
        "integration_channel_model",
    ] {
        assert!(
            sql.contains(required_table),
            "snapshot load queries must reference {required_table}"
        );
    }

    assert!(
        !sql.contains("$1"),
        "snapshot load queries must be executable without request-time parameters"
    );
    assert!(
        !sql.contains("gateway_model"),
        "snapshot load queries must use integration_channel_model.model"
    );
    assert!(sql.contains("price_side_code"));
    assert!(sql.contains("base_price_side_code"));
    assert!(
        PricingCatalogSql::load_api_keys().contains("key_hash"),
        "API key snapshot query must load iam_gateway_api_key.key_hash for credential authentication"
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
        PricingCatalogSql::load_provider_routes().contains("secret_ref"),
        "provider route snapshot query must project provider account secret_ref"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("timeout_ms"),
        "provider route snapshot query must project integration_channel.timeout_ms for provider egress timeout control"
    );
    assert!(
        PricingCatalogSql::load_provider_routes().contains("retry_policy"),
        "provider route snapshot query must project integration_channel.retry_policy for provider egress retry control"
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
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "openai/global/gpt-4o-mini".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
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
        policy_id: Some(700),
        quota_policy_id: Some(900),
        created_at: "2026-04-10 20:55:41".to_owned(),
        expire_at: Some("2027-01-01 00:00:00".to_owned()),
        status_code: 1,
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

    let metric_snapshot = ApiKeyGroupMetricSnapshotRow {
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

    let group = ApiKeyGroupRow {
        id: 10,
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
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
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
    assert_eq!("0.110000", price.unit_price.to_fixed_string(6));
}

#[test]
fn row_mappers_reject_invalid_decimal_and_unknown_price_side() {
    let invalid_group = ApiKeyGroupRow {
        id: 10,
        code: "standard-group".to_owned(),
        pricing_plan_code: "standard".to_owned(),
        rate_multiplier: "not-a-decimal".to_owned(),
        official_price_multiplier: "1.000000".to_owned(),
    };
    assert!(invalid_group.try_into_domain().is_err());

    let invalid_price = ModelPriceRow {
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
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
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "openai/global/gpt-4o-mini".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
        timeout_ms: Some(0),
        retry_policy_json: None,
    };
    let error = invalid_timeout.try_into_domain().unwrap_err();
    assert!(error.to_string().contains("timeout_ms must be positive"));

    let invalid_retry_policy = ModelProviderRouteRow {
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "openai/global/gpt-4o-mini".to_owned(),
        base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
        secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
        timeout_ms: Some(30_000),
        retry_policy_json: Some(r#"{"max_attempts":0,"retryable_status_codes":[503]}"#.to_owned()),
    };
    let error = invalid_retry_policy.try_into_domain().unwrap_err();
    assert!(error
        .to_string()
        .contains("integration_channel.retry_policy"));
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
}

#[test]
fn sql_catalog_snapshot_rejects_invalid_rows_before_serving_catalog() {
    let mut rows = priced_catalog_rows();
    rows.prices.push(ModelPriceRow {
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        model: "gpt-4o-mini".to_owned(),
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
    assert!(error
        .to_string()
        .contains("integration_channel.retry_policy"));
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
                catalog_key: "openai/global/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                provider_code: "openrouter".to_owned(),
                channel_id: 3001,
                provider_model: "openai/global/gpt-4o-mini".to_owned(),
                base_url: Some("http://provider-proxy.internal/openrouter".to_owned()),
                secret_ref: Some("vault://providers/openrouter/account/main".to_owned()),
                timeout_ms: Some(30_000),
                retry_policy_json: Some(
                    r#"{"max_attempts":3,"retryable_status_codes":[429,500,503],"backoff_ms":25}"#
                        .to_owned(),
                ),
            },
            ModelProviderRouteRow {
                catalog_key: "openai/global/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                provider_code: "azure_openai".to_owned(),
                channel_id: 2001,
                provider_model: "gpt-4o-mini".to_owned(),
                base_url: Some("http://provider-proxy.internal/azure".to_owned()),
                secret_ref: Some("vault://providers/azure/account/main".to_owned()),
                timeout_ms: None,
                retry_policy_json: None,
            },
        ],
        pricing_plans: vec![PricingPlanRow {
            plan_code: "standard".to_owned(),
            base_price_side_code: "official_reference".to_owned(),
            default_multiplier: "1.200000".to_owned(),
            default_markup_amount: "0.000000".to_owned(),
            currency: "USD".to_owned(),
        }],
        api_key_groups: vec![ApiKeyGroupRow {
            id: 10,
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
            policy_id: Some(700),
            quota_policy_id: Some(900),
            created_at: "2026-04-10 20:55:41".to_owned(),
            expire_at: Some("2027-01-01 00:00:00".to_owned()),
            status_code: 1,
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
        api_key_group_metric_snapshots: vec![ApiKeyGroupMetricSnapshotRow {
            group_id: 10,
            capacity_used: Some("37.500000".to_owned()),
            capacity_limit: Some("1000.000000".to_owned()),
            usage_amount_total: Some("37.500000".to_owned()),
            snapshot_at: Some("2026-04-29 00:00:00".to_owned()),
        }],
        prices: vec![
            ModelPriceRow {
                catalog_key: "openai/global/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                price_side_code: "official_reference".to_owned(),
                billing_meter_code: "llm_input_token".to_owned(),
                unit_price: "0.150000".to_owned(),
                currency: "USD".to_owned(),
                provider_code: None,
                channel_id: None,
                pricing_plan_code: None,
            },
            ModelPriceRow {
                catalog_key: "openai/global/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
                price_side_code: "upstream_cost".to_owned(),
                billing_meter_code: "llm_input_token".to_owned(),
                unit_price: "0.110000".to_owned(),
                currency: "USD".to_owned(),
                provider_code: Some("openrouter".to_owned()),
                channel_id: Some(3001),
                pricing_plan_code: None,
            },
            ModelPriceRow {
                catalog_key: "openai/global/gpt-4o-mini".to_owned(),
                model: "gpt-4o-mini".to_owned(),
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
