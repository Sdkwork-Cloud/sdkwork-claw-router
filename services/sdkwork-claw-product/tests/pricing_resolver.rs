use sdkwork_claw_product::application::{
    PricingResolver, ResolveModelPriceQuery, ResolvedPriceSource,
};
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
};
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;

fn catalog_with_openai_model() -> InMemoryPricingCatalog {
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
    catalog.add_provider_route(
        ModelProviderRoute::new(
            "gpt-4o-mini",
            "openrouter",
            3001,
            "openai/global/gpt-4o-mini",
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
    catalog.add_api_key(GatewayApiKey::new(100, 10, "sk-test", "hash:sk-test"));
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::LlmInputToken,
            Money::usd("0.150000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.110000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini")
        .for_provider("openrouter", 3001),
    );
    catalog
}

#[test]
fn resolves_customer_price_from_api_key_group_plan_and_official_reference() {
    let catalog = catalog_with_openai_model();
    let resolver = PricingResolver::new(&catalog);

    let resolved = resolver
        .resolve(ResolveModelPriceQuery {
            api_key_id: 100,
            model: "openai/global/gpt-4o-mini".to_owned(),
            billing_meter: BillingMeter::LlmInputToken,
            provider_code: Some("openrouter".to_owned()),
        })
        .unwrap();

    assert_eq!("standard-group", resolved.group_code);
    assert_eq!("standard", resolved.pricing_plan_code);
    assert_eq!(ModelVendor::OpenAi, resolved.vendor);
    assert_eq!("openrouter", resolved.provider_code.as_deref().unwrap());
    assert_eq!(
        ResolvedPriceSource::DerivedFromOfficialReference,
        resolved.source
    );
    assert_eq!(
        "0.150000",
        resolved.official_reference.unit_price.to_fixed_string(6)
    );
    assert_eq!(
        "0.110000",
        resolved
            .upstream_cost
            .unwrap()
            .unit_price
            .to_fixed_string(6)
    );
    assert_eq!(
        "0.198000",
        resolved.customer_charge.unit_price.to_fixed_string(6)
    );
    assert_eq!(
        "0.088000",
        resolved.gross_margin_per_unit.unwrap().to_fixed_string(6)
    );
}

#[test]
fn explicit_plan_customer_price_overrides_official_reference_and_keeps_group_multiplier() {
    let mut catalog = catalog_with_openai_model();
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::CustomerCharge,
            BillingMeter::LlmInputToken,
            Money::usd("0.300000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini")
        .for_pricing_plan("standard"),
    );
    catalog.update_group_rate_multiplier(10, DecimalValue::parse("0.900000").unwrap());
    let resolver = PricingResolver::new(&catalog);

    let resolved = resolver
        .resolve(ResolveModelPriceQuery {
            api_key_id: 100,
            model: "openai/global/gpt-4o-mini".to_owned(),
            billing_meter: BillingMeter::LlmInputToken,
            provider_code: Some("openrouter".to_owned()),
        })
        .unwrap();

    assert_eq!(ResolvedPriceSource::ExplicitCustomerCharge, resolved.source);
    assert_eq!(
        "0.270000",
        resolved.customer_charge.unit_price.to_fixed_string(6)
    );
    assert_eq!(
        "0.160000",
        resolved.gross_margin_per_unit.unwrap().to_fixed_string(6)
    );
}

#[test]
fn supports_non_token_meter_without_new_pricing_table_shape() {
    let mut catalog = catalog_with_openai_model();
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::ApiResult,
            Money::usd("0.020000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    let resolver = PricingResolver::new(&catalog);

    let resolved = resolver
        .resolve(ResolveModelPriceQuery {
            api_key_id: 100,
            model: "openai/global/gpt-4o-mini".to_owned(),
            billing_meter: BillingMeter::ApiResult,
            provider_code: None,
        })
        .unwrap();

    assert_eq!(BillingMeter::ApiResult, resolved.billing_meter);
    assert_eq!(
        "0.026400",
        resolved.customer_charge.unit_price.to_fixed_string(6)
    );
}

#[test]
fn missing_price_returns_a_domain_error_instead_of_fake_success() {
    let catalog = catalog_with_openai_model();
    let resolver = PricingResolver::new(&catalog);

    let error = resolver
        .resolve(ResolveModelPriceQuery {
            api_key_id: 100,
            model: "openai/global/gpt-4o-mini".to_owned(),
            billing_meter: BillingMeter::VideoOutputSecond,
            provider_code: None,
        })
        .unwrap_err();

    assert!(error.to_string().contains("official reference price"));
}
