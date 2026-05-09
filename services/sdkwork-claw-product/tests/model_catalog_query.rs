use sdkwork_claw_product::application::{
    ListModelCatalogQuery, ModelCatalogQueryService, PriceAvailability,
};
use sdkwork_claw_product::domain::{
    AiModel, ApiKeyGroup, BillingMeter, DecimalValue, GatewayApiKey, ModelPrice,
    ModelProviderRoute, ModelVendor, ModelVendorDefinition, Money, PriceSide, PricingPlan,
};
use sdkwork_claw_product::infrastructure::InMemoryPricingCatalog;

fn catalog_for_model_list() -> InMemoryPricingCatalog {
    let mut catalog = InMemoryPricingCatalog::default();
    catalog.add_vendor(ModelVendorDefinition::new(
        "openai",
        ModelVendor::OpenAi,
        "OpenAI",
    ));
    catalog.add_vendor(ModelVendorDefinition::new(
        "anthropic",
        ModelVendor::Anthropic,
        "Anthropic",
    ));
    catalog.add_model(
        AiModel::new(
            "gpt-4o-mini",
            "GPT-4o mini",
            "openai",
            vec!["chat", "tools", "json_schema"],
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    catalog.add_model(AiModel::new(
        "claude-3-haiku",
        "Claude 3 Haiku",
        "anthropic",
        vec!["chat"],
    ));
    catalog.add_provider_route(
        ModelProviderRoute::new(
            "gpt-4o-mini",
            "openrouter",
            3001,
            "openai/global/gpt-4o-mini",
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    catalog.add_provider_route(
        ModelProviderRoute::new("gpt-4o-mini", "azure_openai", 2001, "gpt-4o-mini")
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
            PriceSide::OfficialReference,
            BillingMeter::LlmOutputToken,
            Money::usd("0.600000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::LlmCacheReadToken,
            Money::usd("0.075000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini"),
    );
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::OfficialReference,
            BillingMeter::LlmInputToken,
            Money::usd("0.151000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini")
        .for_provider("openrouter", 3001),
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
    catalog.add_price(
        ModelPrice::new(
            "gpt-4o-mini",
            PriceSide::UpstreamCost,
            BillingMeter::LlmInputToken,
            Money::usd("0.120000").unwrap(),
        )
        .with_catalog_key("openai/global/gpt-4o-mini")
        .for_provider("azure_openai", 2001),
    );
    catalog
}

#[test]
fn lists_models_with_customer_price_provider_count_and_vendor_filter() {
    let catalog = catalog_for_model_list();
    let service = ModelCatalogQueryService::new(&catalog);

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
    assert_eq!("openai/global/gpt-4o-mini", item.catalog_key);
    assert_eq!("GPT-4o mini", item.display_name);
    assert_eq!("openai", item.vendor_code);
    assert_eq!("global", item.region_code);
    assert_eq!(ModelVendor::OpenAi, item.vendor);
    assert_eq!(vec!["chat", "tools", "json_schema"], item.capabilities);
    assert_eq!(vec!["azure_openai", "openrouter"], item.provider_codes);
    assert_eq!(
        "0.150000",
        item.official_reference_unit_price.as_deref().unwrap()
    );
    assert_eq!("USD", item.official_reference_currency.as_deref().unwrap());
    assert_eq!(
        "0.110000",
        item.lowest_upstream_cost_unit_price.as_deref().unwrap()
    );
    assert_eq!(3, item.official_reference_prices.len());
    assert_reference_price(item, "llm_input_token", "0.150000", "USD");
    assert_reference_price(item, "llm_output_token", "0.600000", "USD");
    assert_reference_price(item, "llm_cache_read_token", "0.075000", "USD");

    match &item.price_availability {
        PriceAvailability::Available(price) => {
            assert_eq!("standard-group", price.group_code);
            assert_eq!("standard", price.pricing_plan_code);
            assert_eq!("0.198000", price.customer_unit_price);
            assert_eq!("0.088000", price.gross_margin_per_unit.as_deref().unwrap());
        }
        PriceAvailability::Unavailable { reason } => {
            panic!("unexpected unavailable price: {reason}")
        }
    }
}

fn assert_reference_price(
    item: &sdkwork_claw_product::application::ModelCatalogItem,
    billing_meter: &str,
    unit_price: &str,
    currency: &str,
) {
    let price = item
        .official_reference_prices
        .iter()
        .find(|price| price.billing_meter == billing_meter)
        .unwrap_or_else(|| panic!("missing official reference price for {billing_meter}"));

    assert_eq!(unit_price, price.unit_price);
    assert_eq!(currency, price.currency);
}

#[test]
fn list_keeps_unpriced_models_explicitly_unavailable_instead_of_fake_success() {
    let catalog = catalog_for_model_list();
    let service = ModelCatalogQueryService::new(&catalog);

    let page = service
        .list_models(ListModelCatalogQuery {
            api_key_id: Some(100),
            billing_meter: BillingMeter::LlmInputToken,
            vendor_code: None,
            vendor_codes: Vec::new(),
            modalities: Vec::new(),
            capabilities: Vec::new(),
            categories: Vec::new(),
            groups: Vec::new(),
            search_query: None,
            limit: None,
        })
        .unwrap();

    assert_eq!(2, page.items.len());
    let claude = page
        .items
        .iter()
        .find(|item| item.model == "claude-3-haiku")
        .unwrap();

    match &claude.price_availability {
        PriceAvailability::Available(price) => {
            panic!("missing pricing must not return fake customer price: {price:?}")
        }
        PriceAvailability::Unavailable { reason } => {
            assert!(reason.contains("official reference price"));
        }
    }
}

#[test]
fn list_models_derives_taxonomy_and_applies_catalog_filters() {
    let catalog = catalog_for_model_list();
    let service = ModelCatalogQueryService::new(&catalog);

    let page = service
        .list_models(ListModelCatalogQuery {
            api_key_id: None,
            billing_meter: BillingMeter::LlmInputToken,
            vendor_code: None,
            vendor_codes: vec!["openai".to_owned(), "anthropic".to_owned()],
            modalities: vec!["text".to_owned()],
            capabilities: vec!["tools".to_owned()],
            categories: vec!["Recommended".to_owned(), "Proprietary".to_owned()],
            groups: vec!["enterprise".to_owned()],
            search_query: Some("gpt".to_owned()),
            limit: Some(10),
        })
        .unwrap();

    assert_eq!(1, page.items.len());
    let item = &page.items[0];
    assert_eq!("openai/global/gpt-4o-mini", item.catalog_key);
    assert_eq!(vec!["default", "enterprise"], item.groups);
    assert_eq!(vec!["Recommended", "Proprietary"], item.categories);
}
