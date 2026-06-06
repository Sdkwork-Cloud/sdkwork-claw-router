use serde::{Deserialize, Serialize};

use crate::models::{AppModelCatalogPriceAvailability, AppModelCatalogReferencePrice};

/// App model catalog item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppModelCatalogItem {
    /// Api format field on app model catalog item.
    #[serde(rename = "apiFormat")]
    pub api_format: String,

    /// Capabilities field on app model catalog item.
    pub capabilities: Vec<String>,

    /// Capability intro field on app model catalog item.
    #[serde(rename = "capabilityIntro")]
    pub capability_intro: String,

    /// Catalog key field on app model catalog item.
    #[serde(rename = "catalogKey")]
    pub catalog_key: String,

    /// Categories field on app model catalog item.
    pub categories: Vec<String>,

    /// Context tokens field on app model catalog item.
    #[serde(rename = "contextTokens")]
    pub context_tokens: String,

    /// Description field on app model catalog item.
    pub description: String,

    /// Display name field on app model catalog item.
    #[serde(rename = "displayName")]
    pub display_name: String,

    /// Groups field on app model catalog item.
    pub groups: Vec<String>,

    /// Input modalities field on app model catalog item.
    #[serde(rename = "inputModalities")]
    pub input_modalities: Vec<String>,

    /// Limitations field on app model catalog item.
    pub limitations: Vec<String>,

    /// Max output tokens field on app model catalog item.
    #[serde(rename = "maxOutputTokens")]
    pub max_output_tokens: String,

    /// Modalities field on app model catalog item.
    pub modalities: Vec<String>,

    /// Model field on app model catalog item.
    pub model: String,

    /// Complete public official reference prices keyed by regionCode and billing meter. Customer, upstream, provider, and channel prices are never exposed here.
    #[serde(rename = "officialReferencePrices")]
    pub official_reference_prices: Vec<AppModelCatalogReferencePrice>,

    /// Output modalities field on app model catalog item.
    #[serde(rename = "outputModalities")]
    pub output_modalities: Vec<String>,

    /// Price availability field on app model catalog item.
    #[serde(rename = "priceAvailability")]
    pub price_availability: AppModelCatalogPriceAvailability,

    /// Provider codes field on app model catalog item.
    #[serde(rename = "providerCodes")]
    pub provider_codes: Vec<String>,

    /// Release stage field on app model catalog item.
    #[serde(rename = "releaseStage")]
    pub release_stage: String,

    /// Replacement model field on app model catalog item.
    #[serde(rename = "replacementModel")]
    pub replacement_model: String,

    /// Routing state field on app model catalog item.
    #[serde(rename = "routingState")]
    pub routing_state: String,

    /// Shelf state field on app model catalog item.
    #[serde(rename = "shelfState")]
    pub shelf_state: String,

    /// Supported languages field on app model catalog item.
    #[serde(rename = "supportedLanguages")]
    pub supported_languages: Vec<String>,

    /// Supports json schema field on app model catalog item.
    #[serde(rename = "supportsJsonSchema")]
    pub supports_json_schema: bool,

    /// Supports streaming field on app model catalog item.
    #[serde(rename = "supportsStreaming")]
    pub supports_streaming: bool,

    /// Supports tools field on app model catalog item.
    #[serde(rename = "supportsTools")]
    pub supports_tools: bool,

    /// Training data cutoff field on app model catalog item.
    #[serde(rename = "trainingDataCutoff")]
    pub training_data_cutoff: String,

    /// Use cases field on app model catalog item.
    #[serde(rename = "useCases")]
    pub use_cases: Vec<String>,

    /// Vendor field on app model catalog item.
    pub vendor: String,

    /// Vendor code field on app model catalog item.
    #[serde(rename = "vendorCode")]
    pub vendor_code: String,
}
