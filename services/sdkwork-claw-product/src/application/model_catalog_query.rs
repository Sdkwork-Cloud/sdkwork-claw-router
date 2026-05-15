use crate::application::{PricingResolver, ResolveModelPriceQuery};
use crate::domain::{BillingMeter, DomainResult, ModelPrice, ModelVendor, PriceSide};
use crate::ports::PricingCatalog;

const MODEL_GROUP_DEFAULT: &str = "default";
const MODEL_GROUP_VIP: &str = "vip";
const MODEL_GROUP_ENTERPRISE: &str = "enterprise";
const MODEL_GROUP_BETA: &str = "beta";
const MODEL_CATEGORY_RECOMMENDED: &str = "Recommended";
const MODEL_CATEGORY_OPEN_SOURCE: &str = "Open Source";
const MODEL_CATEGORY_PROPRIETARY: &str = "Proprietary";
const MODEL_CATEGORY_FREE: &str = "Free";
const MODEL_CATEGORY_NEW: &str = "New";
const MAX_MODEL_CATALOG_LIMIT: usize = 1_000;
const INVALID_MODEL_CATEGORY_FILTER: &str = "__invalid_model_category__";

pub struct ModelCatalogQueryService<'a, C: PricingCatalog> {
    catalog: &'a C,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListModelCatalogQuery {
    pub api_key_id: Option<i64>,
    pub billing_meter: BillingMeter,
    pub vendor_code: Option<String>,
    pub vendor_codes: Vec<String>,
    pub modalities: Vec<String>,
    pub capabilities: Vec<String>,
    pub categories: Vec<String>,
    pub groups: Vec<String>,
    pub search_query: Option<String>,
    pub limit: Option<usize>,
}

impl ListModelCatalogQuery {
    pub fn normalized_vendor_codes(&self) -> Vec<String> {
        let mut values = normalize_filter_values(&self.vendor_codes);
        if let Some(vendor_code) = normalize_filter_value(self.vendor_code.as_deref()) {
            values.push(vendor_code);
        }
        values.sort();
        values.dedup();
        values
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModelCatalogPage {
    pub items: Vec<ModelCatalogItem>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModelCatalogItem {
    pub catalog_key: String,
    pub model: String,
    pub display_name: String,
    pub vendor_code: String,
    pub region_code: String,
    pub vendor: ModelVendor,
    pub capabilities: Vec<String>,
    pub groups: Vec<String>,
    pub categories: Vec<String>,
    pub description: Option<String>,
    pub modalities: Vec<String>,
    pub input_modalities: Vec<String>,
    pub output_modalities: Vec<String>,
    pub api_format: Option<String>,
    pub capability_intro: Option<String>,
    pub limitations: Vec<String>,
    pub supported_languages: Vec<String>,
    pub use_cases: Vec<String>,
    pub training_data_cutoff: Option<String>,
    pub context_tokens: Option<i64>,
    pub max_output_tokens: Option<i64>,
    pub supports_streaming: bool,
    pub supports_tools: bool,
    pub supports_json_schema: bool,
    pub release_stage: Option<i32>,
    pub shelf_state: Option<i32>,
    pub routing_state: Option<i32>,
    pub replacement_model: Option<String>,
    pub provider_codes: Vec<String>,
    pub official_reference_unit_price: Option<String>,
    pub official_reference_currency: Option<String>,
    pub official_reference_prices: Vec<ModelCatalogReferencePriceView>,
    pub lowest_upstream_cost_unit_price: Option<String>,
    pub lowest_upstream_cost_currency: Option<String>,
    pub price_availability: PriceAvailability,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModelCatalogReferencePriceView {
    pub billing_meter: String,
    pub unit_price: String,
    pub currency: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PriceAvailability {
    Available(ModelCatalogPriceView),
    Unavailable { reason: String },
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ModelCatalogPriceView {
    pub group_code: String,
    pub pricing_plan_code: String,
    pub customer_unit_price: String,
    pub gross_margin_per_unit: Option<String>,
}

impl<'a, C: PricingCatalog> ModelCatalogQueryService<'a, C> {
    pub fn new(catalog: &'a C) -> Self {
        Self { catalog }
    }

    pub fn list_models(&self, query: ListModelCatalogQuery) -> DomainResult<ModelCatalogPage> {
        let resolver = PricingResolver::new(self.catalog);
        let vendor_codes = query.normalized_vendor_codes();
        let modalities = normalize_modality_filter_values(&query.modalities);
        let capabilities = normalize_capability_filter_values(&query.capabilities);
        let categories = normalize_category_filter_values(&query.categories);
        let groups = normalize_filter_values(&query.groups);
        let search_query = normalize_filter_value(query.search_query.as_deref());
        let limit = query
            .limit
            .unwrap_or(MAX_MODEL_CATALOG_LIMIT)
            .min(MAX_MODEL_CATALOG_LIMIT);
        let models = self
            .catalog
            .list_models(None)
            .into_iter()
            .map(|model| {
                let vendor = self
                    .catalog
                    .find_vendor(&model.vendor_code)
                    .map(|vendor| vendor.vendor)
                    .unwrap_or(ModelVendor::Unknown);
                let model_lookup_key = model.catalog_key.as_str();
                let provider_codes = self.provider_codes(model_lookup_key);
                let official_reference =
                    self.official_reference(model_lookup_key, query.billing_meter.clone());
                let official_reference_prices = self.official_reference_prices(model_lookup_key);
                let lowest_upstream_cost =
                    self.lowest_upstream_cost(model_lookup_key, query.billing_meter.clone());
                let provider_for_resolve = lowest_upstream_cost
                    .as_ref()
                    .and_then(|price| price.provider_code.clone())
                    .or_else(|| provider_codes.first().cloned());
                let price_availability = query
                    .api_key_id
                    .map(|api_key_id| {
                        resolver.resolve(ResolveModelPriceQuery {
                            api_key_id,
                            model: model_lookup_key.to_owned(),
                            billing_meter: query.billing_meter.clone(),
                            provider_code: provider_for_resolve,
                            channel_id: None,
                        })
                    })
                    .map(to_price_availability)
                    .unwrap_or_else(|| PriceAvailability::Unavailable {
                        reason: "api key context is required for customer price".to_owned(),
                    });

                let groups = derive_model_groups(&model);
                let categories =
                    derive_model_categories(&model, &vendor, &official_reference_prices);

                ModelCatalogItem {
                    catalog_key: model.catalog_key,
                    model: model.model,
                    display_name: model.display_name,
                    vendor_code: model.vendor_code,
                    region_code: model.region_code,
                    vendor,
                    capabilities: model.capabilities,
                    groups,
                    categories,
                    description: model.description,
                    modalities: model.modalities,
                    input_modalities: model.input_modalities,
                    output_modalities: model.output_modalities,
                    api_format: model.api_format,
                    capability_intro: model.capability_intro,
                    limitations: model.limitations,
                    supported_languages: model.supported_languages,
                    use_cases: model.use_cases,
                    training_data_cutoff: model.training_data_cutoff,
                    context_tokens: model.context_tokens,
                    max_output_tokens: model.max_output_tokens,
                    supports_streaming: model.supports_streaming,
                    supports_tools: model.supports_tools,
                    supports_json_schema: model.supports_json_schema,
                    release_stage: model.release_stage,
                    shelf_state: model.shelf_state,
                    routing_state: model.routing_state,
                    replacement_model: model.replacement_model,
                    provider_codes,
                    official_reference_unit_price: official_reference
                        .as_ref()
                        .map(|price| price.unit_price.to_fixed_string(6)),
                    official_reference_currency: official_reference
                        .as_ref()
                        .map(|price| price.unit_price.currency.clone()),
                    official_reference_prices,
                    lowest_upstream_cost_unit_price: lowest_upstream_cost
                        .as_ref()
                        .map(|price| price.unit_price.to_fixed_string(6)),
                    lowest_upstream_cost_currency: lowest_upstream_cost
                        .as_ref()
                        .map(|price| price.unit_price.currency.clone()),
                    price_availability,
                }
            })
            .filter(|item| {
                model_matches_filter(
                    item,
                    &vendor_codes,
                    &modalities,
                    &capabilities,
                    &categories,
                    &groups,
                    search_query.as_deref(),
                )
            })
            .take(limit)
            .collect();

        Ok(ModelCatalogPage { items: models })
    }

    fn provider_codes(&self, model: &str) -> Vec<String> {
        let mut provider_codes: Vec<String> = self
            .catalog
            .list_provider_routes(model)
            .into_iter()
            .map(|route| route.provider_code)
            .collect();
        provider_codes.sort();
        provider_codes.dedup();
        provider_codes
    }

    fn official_reference(&self, model: &str, billing_meter: BillingMeter) -> Option<ModelPrice> {
        self.catalog.find_model_price(
            model,
            PriceSide::OfficialReference,
            billing_meter,
            None,
            None,
        )
    }

    fn official_reference_prices(&self, model: &str) -> Vec<ModelCatalogReferencePriceView> {
        let mut prices: Vec<ModelCatalogReferencePriceView> = self
            .catalog
            .list_model_prices_for_side(model, PriceSide::OfficialReference)
            .into_iter()
            .filter(|price| {
                price.provider_code.is_none()
                    && price.channel_id.is_none()
                    && price.pricing_plan_code.is_none()
            })
            .map(|price| ModelCatalogReferencePriceView {
                billing_meter: price.billing_meter.code().to_owned(),
                unit_price: price.unit_price.to_fixed_string(6),
                currency: price.unit_price.currency,
            })
            .collect();
        prices.sort_by(|left, right| {
            billing_meter_sort_key(&left.billing_meter)
                .cmp(&billing_meter_sort_key(&right.billing_meter))
                .then_with(|| left.billing_meter.cmp(&right.billing_meter))
        });
        prices.dedup_by(|left, right| left.billing_meter == right.billing_meter);
        prices
    }

    fn lowest_upstream_cost(&self, model: &str, billing_meter: BillingMeter) -> Option<ModelPrice> {
        self.catalog
            .list_model_prices(model, PriceSide::UpstreamCost, billing_meter)
            .into_iter()
            .min_by_key(|price| price.unit_price.unit_price)
    }
}

fn derive_model_groups(model: &crate::domain::AiModel) -> Vec<String> {
    let mut groups = Vec::new();
    if model_is_public_default(model) {
        groups.push(MODEL_GROUP_DEFAULT.to_owned());
    }
    if model_is_enterprise(model) {
        groups.push(MODEL_GROUP_ENTERPRISE.to_owned());
    }
    if model_is_vip(model) {
        groups.push(MODEL_GROUP_VIP.to_owned());
    }
    if model_is_beta(model) {
        groups.push(MODEL_GROUP_BETA.to_owned());
    }
    groups.sort_by_key(|group| model_group_sort_key(group));
    groups.dedup();
    groups
}

fn derive_model_categories(
    model: &crate::domain::AiModel,
    vendor: &ModelVendor,
    reference_prices: &[ModelCatalogReferencePriceView],
) -> Vec<String> {
    let groups = derive_model_groups(model);
    let mut categories = Vec::new();
    if groups.iter().any(|group| group == MODEL_GROUP_DEFAULT) {
        categories.push(MODEL_CATEGORY_RECOMMENDED.to_owned());
    }
    if is_open_source_vendor(vendor, &model.vendor_code) {
        categories.push(MODEL_CATEGORY_OPEN_SOURCE.to_owned());
    } else if vendor != &ModelVendor::Unknown {
        categories.push(MODEL_CATEGORY_PROPRIETARY.to_owned());
    }
    if model_is_free(reference_prices) {
        categories.push(MODEL_CATEGORY_FREE.to_owned());
    }
    if groups.iter().any(|group| group == MODEL_GROUP_BETA) {
        categories.push(MODEL_CATEGORY_NEW.to_owned());
    }
    categories.sort_by_key(|category| model_category_sort_key(category));
    categories.dedup();
    categories
}

fn model_is_public_default(model: &crate::domain::AiModel) -> bool {
    model.shelf_state.unwrap_or(1) == 1 && model.routing_state.unwrap_or(1) == 1
}

fn model_is_enterprise(model: &crate::domain::AiModel) -> bool {
    model.supports_tools
        || model.supports_json_schema
        || model.context_tokens.unwrap_or_default() >= 128_000
        || has_multimodal_io(model)
        || has_any_normalized(
            &model.capabilities,
            &["tools", "json_schema", "function_calling", "long_context"],
        )
}

fn model_is_vip(model: &crate::domain::AiModel) -> bool {
    model.context_tokens.unwrap_or_default() >= 1_000_000
        || has_any_normalized(
            &model.capabilities,
            &["reasoning", "video", "audio", "music"],
        )
}

fn model_is_beta(model: &crate::domain::AiModel) -> bool {
    model.release_stage.unwrap_or(1) == 2
}

fn has_multimodal_io(model: &crate::domain::AiModel) -> bool {
    normalized_model_modalities(model)
        .into_iter()
        .any(|modality| modality != "text" && modality != "chat" && modality != "llm")
}

fn has_any_normalized(values: &[String], needles: &[&str]) -> bool {
    values
        .iter()
        .map(|value| normalize_semantic_token(value))
        .any(|value| needles.iter().any(|needle| value == *needle))
}

fn is_open_source_vendor(vendor: &ModelVendor, vendor_code: &str) -> bool {
    vendor == &ModelVendor::DeepSeek
        || matches!(
            normalize_filter_value(Some(vendor_code)).as_deref(),
            Some("meta" | "mistral" | "deepseek" | "01ai")
        )
}

fn model_is_free(reference_prices: &[ModelCatalogReferencePriceView]) -> bool {
    !reference_prices.is_empty()
        && reference_prices.iter().all(|price| {
            price
                .unit_price
                .trim()
                .parse::<f64>()
                .map(|value| value == 0.0)
                .unwrap_or(false)
        })
}

fn model_matches_filter(
    item: &ModelCatalogItem,
    vendor_codes: &[String],
    modalities: &[String],
    capabilities: &[String],
    categories: &[String],
    groups: &[String],
    search_query: Option<&str>,
) -> bool {
    (vendor_codes.is_empty()
        || vendor_codes
            .iter()
            .any(|value| value == &normalize_semantic_token(&item.vendor_code)))
        && (modalities.is_empty()
            || normalized_item_modalities(item)
                .iter()
                .any(|value| modalities.contains(value)))
        && (capabilities.is_empty()
            || capabilities
                .iter()
                .all(|capability| normalized_item_capabilities(item).contains(capability)))
        && (categories.is_empty()
            || categories
                .iter()
                .all(|category| item.categories.iter().any(|value| value == category)))
        && (groups.is_empty()
            || groups.iter().any(|group| {
                item.groups
                    .iter()
                    .any(|value| normalize_semantic_token(value) == *group)
            }))
        && search_query_matches(item, search_query)
}

fn search_query_matches(item: &ModelCatalogItem, search_query: Option<&str>) -> bool {
    let Some(search_query) = search_query else {
        return true;
    };
    let haystack = [
        item.catalog_key.as_str(),
        item.model.as_str(),
        item.display_name.as_str(),
        item.vendor_code.as_str(),
        item.description.as_deref().unwrap_or_default(),
    ]
    .join(" ")
    .to_ascii_lowercase();
    haystack.contains(search_query)
}

fn normalized_item_modalities(item: &ModelCatalogItem) -> Vec<String> {
    let mut values = item
        .modalities
        .iter()
        .chain(item.input_modalities.iter())
        .chain(item.output_modalities.iter())
        .flat_map(|value| normalize_modality_token(value))
        .filter(|value| !value.is_empty())
        .collect::<Vec<_>>();
    if values.is_empty() {
        values = normalized_item_capabilities(item);
    }
    values.sort();
    values.dedup();
    values
}

fn normalized_item_capabilities(item: &ModelCatalogItem) -> Vec<String> {
    let mut values = item
        .capabilities
        .iter()
        .map(|value| normalize_semantic_token(value))
        .filter(|value| !value.is_empty())
        .collect::<Vec<_>>();
    values.sort();
    values.dedup();
    values
}

fn normalize_capability_filter_values(values: &[String]) -> Vec<String> {
    let mut normalized = values
        .iter()
        .flat_map(|value| value.split(','))
        .filter_map(|value| normalize_filter_value(Some(value)))
        .map(|value| match value.as_str() {
            "function_calling" | "function_call" | "tool_calling" => "tools".to_owned(),
            "json" | "json_mode" => "json_schema".to_owned(),
            "vision" => "image".to_owned(),
            value => value.to_owned(),
        })
        .collect::<Vec<_>>();
    normalized.sort();
    normalized.dedup();
    normalized
}

fn normalized_model_modalities(model: &crate::domain::AiModel) -> Vec<String> {
    let mut values = model
        .modalities
        .iter()
        .chain(model.input_modalities.iter())
        .chain(model.output_modalities.iter())
        .flat_map(|value| normalize_modality_token(value))
        .filter(|value| !value.is_empty())
        .collect::<Vec<_>>();
    if values.is_empty() {
        values = model
            .capabilities
            .iter()
            .map(|value| normalize_semantic_token(value))
            .filter(|value| !value.is_empty())
            .collect();
    }
    values.sort();
    values.dedup();
    values
}

fn normalize_modality_filter_values(values: &[String]) -> Vec<String> {
    let mut normalized = values
        .iter()
        .flat_map(|value| value.split(','))
        .flat_map(normalize_modality_token)
        .filter(|value| !value.is_empty())
        .collect::<Vec<_>>();
    normalized.sort();
    normalized.dedup();
    normalized
}

fn normalize_modality_token(value: &str) -> Vec<String> {
    match normalize_semantic_token(value).as_str() {
        "text" | "chat" | "llm" => vec!["text".to_owned(), "chat".to_owned(), "llm".to_owned()],
        "speech" | "voice" | "audio" => {
            vec!["audio".to_owned(), "speech".to_owned(), "voice".to_owned()]
        }
        value => vec![value.to_owned()],
    }
}

fn normalize_filter_values(values: &[String]) -> Vec<String> {
    let mut normalized = values
        .iter()
        .flat_map(|value| value.split(','))
        .filter_map(|value| normalize_filter_value(Some(value)))
        .collect::<Vec<_>>();
    normalized.sort();
    normalized.dedup();
    normalized
}

fn normalize_category_filter_values(values: &[String]) -> Vec<String> {
    let mut normalized = values
        .iter()
        .flat_map(|value| value.split(','))
        .filter_map(normalize_category_filter_value)
        .collect::<Vec<_>>();
    normalized.sort_by_key(|category| model_category_sort_key(category));
    normalized.dedup();
    normalized
}

fn normalize_filter_value(value: Option<&str>) -> Option<String> {
    value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(normalize_semantic_token)
}

fn normalize_category_filter_value(value: &str) -> Option<String> {
    match value
        .trim()
        .to_ascii_lowercase()
        .replace(['_', '-'], " ")
        .as_str()
    {
        "recommended" => Some(MODEL_CATEGORY_RECOMMENDED.to_owned()),
        "open source" => Some(MODEL_CATEGORY_OPEN_SOURCE.to_owned()),
        "proprietary" => Some(MODEL_CATEGORY_PROPRIETARY.to_owned()),
        "free" => Some(MODEL_CATEGORY_FREE.to_owned()),
        "new" => Some(MODEL_CATEGORY_NEW.to_owned()),
        value if value.trim().is_empty() => None,
        _ => Some(INVALID_MODEL_CATEGORY_FILTER.to_owned()),
    }
}

fn normalize_semantic_token(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace([' ', '-'], "_")
}

fn model_group_sort_key(group: &str) -> usize {
    match group {
        MODEL_GROUP_DEFAULT => 10,
        MODEL_GROUP_VIP => 20,
        MODEL_GROUP_ENTERPRISE => 30,
        MODEL_GROUP_BETA => 40,
        _ => usize::MAX,
    }
}

fn model_category_sort_key(category: &str) -> usize {
    match category {
        MODEL_CATEGORY_RECOMMENDED => 10,
        MODEL_CATEGORY_OPEN_SOURCE => 20,
        MODEL_CATEGORY_PROPRIETARY => 30,
        MODEL_CATEGORY_FREE => 40,
        MODEL_CATEGORY_NEW => 50,
        _ => usize::MAX,
    }
}

fn billing_meter_sort_key(billing_meter: &str) -> usize {
    match billing_meter {
        "llm_input_token" => 10,
        "llm_output_token" => 20,
        "llm_reasoning_token" => 30,
        "llm_cache_write_token" => 40,
        "llm_cache_read_token" => 50,
        "embedding_input_token" => 100,
        "image_input_token" => 200,
        "image_output_token" => 210,
        "image_result" => 220,
        "audio_input_token" => 300,
        "audio_output_token" => 310,
        "audio_input_second" => 320,
        "audio_output_second" => 330,
        "stt_audio_minute" => 340,
        "tts_input_character" => 350,
        "video_input_token" => 400,
        "video_output_token" => 410,
        "video_input_second" => 420,
        "video_output_second" => 430,
        "video_result" => 440,
        "music_output_second" => 500,
        "sfx_result" => 510,
        _ => usize::MAX,
    }
}

fn to_price_availability(
    resolved: DomainResult<crate::application::ResolvedModelPrice>,
) -> PriceAvailability {
    match resolved {
        Ok(price) => PriceAvailability::Available(ModelCatalogPriceView {
            group_code: price.group_code,
            pricing_plan_code: price.pricing_plan_code,
            customer_unit_price: price.customer_charge.to_fixed_string(6),
            gross_margin_per_unit: price
                .gross_margin_per_unit
                .map(|margin| margin.to_fixed_string(6)),
        }),
        Err(error) => PriceAvailability::Unavailable {
            reason: error.to_string(),
        },
    }
}
