use serde::{Deserialize, Serialize};

/// Ai model pricing record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelPricingRecord {
    /// Billing meter code field on ai model pricing record.
    pub billing_meter_code: String,

    /// Billing meter id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_id: Option<String>,

    /// Billing mode field on ai model pricing record.
    pub billing_mode: String,

    /// Billing type field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_type: Option<String>,

    /// Catalog key field on ai model pricing record.
    pub catalog_key: String,

    /// Channel id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Created at field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai model pricing record.
    pub currency: String,

    /// Data scope field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai model pricing record.
    pub effective_from: String,

    /// Effective to field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Import snapshot id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub import_snapshot_id: Option<String>,

    /// Included quantity field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub included_quantity: Option<String>,

    /// Markup amount field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub markup_amount: Option<String>,

    /// Metadata field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metering mode field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metering_mode: Option<String>,

    /// Min charge amount field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub min_charge_amount: Option<String>,

    /// Minimum quantity field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub minimum_quantity: Option<String>,

    /// Model field on ai model pricing record.
    pub model: String,

    /// Model id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Observed at field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub observed_at: Option<String>,

    /// Organization id field on ai model pricing record.
    pub organization_id: String,

    /// Platform code field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_code: Option<String>,

    /// Price item type field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_item_type: Option<String>,

    /// Price origin field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_origin: Option<String>,

    /// Price side field on ai model pricing record.
    pub price_side: String,

    /// Price version field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_version: Option<String>,

    /// Pricing formula mode field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_formula_mode: Option<String>,

    /// Pricing plan code field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_code: Option<String>,

    /// Pricing plan id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_id: Option<String>,

    /// Pricing scope field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_scope: Option<String>,

    /// Pricing scope id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_scope_id: Option<String>,

    /// Priority field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Provider code field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider model field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Published at field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Quantity formula field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_formula: Option<String>,

    /// Quantity source field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_source: Option<String>,

    /// Quantity step field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_step: Option<String>,

    /// Reference multiplier field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_multiplier: Option<String>,

    /// Reference price id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_price_id: Option<String>,

    /// Reference price side field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_price_side: Option<String>,

    /// Region code field on ai model pricing record.
    pub region_code: String,

    /// Result selector field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result_selector: Option<String>,

    /// Rounding mode field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rounding_mode: Option<String>,

    /// Service tier field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub service_tier: Option<String>,

    /// Source hash field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_hash: Option<String>,

    /// Source price id field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_price_id: Option<String>,

    /// Source url field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_url: Option<String>,

    /// Status field on ai model pricing record.
    pub status: String,

    /// Tenant id field on ai model pricing record.
    pub tenant_id: String,

    /// Unit field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit: Option<String>,

    /// Unit price field on ai model pricing record.
    pub unit_price: String,

    /// Unit size field on ai model pricing record.
    pub unit_size: String,

    /// Updated at field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model pricing record.
    pub uuid: String,

    /// Vendor code field on ai model pricing record.
    pub vendor_code: String,

    /// Version field on ai model pricing record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
