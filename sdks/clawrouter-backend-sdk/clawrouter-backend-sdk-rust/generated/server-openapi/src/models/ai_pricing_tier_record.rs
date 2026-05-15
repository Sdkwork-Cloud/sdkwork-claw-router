use serde::{Deserialize, Serialize};

/// Ai pricing tier record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiPricingTierRecord {
    /// Audio unit price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audio_unit_price: Option<String>,

    /// Billing meter code field on ai pricing tier record.
    pub billing_meter_code: String,

    /// Billing meter id field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_id: Option<String>,

    /// Billing mode field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_mode: Option<String>,

    /// Cache read unit price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cache_read_unit_price: Option<String>,

    /// Cache write unit price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cache_write_unit_price: Option<String>,

    /// Created at field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data scope field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai pricing tier record.
    pub effective_from: String,

    /// Effective to field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Image unit price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image_unit_price: Option<String>,

    /// Included quantity field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub included_quantity: Option<String>,

    /// Input unit price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_unit_price: Option<String>,

    /// Max quantity field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_quantity: Option<String>,

    /// Metadata field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Min quantity field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub min_quantity: Option<String>,

    /// Model pricing id field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_pricing_id: Option<String>,

    /// Multiplier field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub multiplier: Option<String>,

    /// Organization id field on ai pricing tier record.
    pub organization_id: String,

    /// Output unit price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_unit_price: Option<String>,

    /// Per request price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub per_request_price: Option<String>,

    /// Price item type field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_item_type: Option<String>,

    /// Pricing rule id field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_rule_id: Option<String>,

    /// Quantity step field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_step: Option<String>,

    /// Quantity unit field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_unit: Option<String>,

    /// Result selector field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result_selector: Option<String>,

    /// Sort order field on ai pricing tier record.
    pub sort_order: i64,

    /// Status field on ai pricing tier record.
    pub status: String,

    /// Tenant id field on ai pricing tier record.
    pub tenant_id: String,

    /// Tier code field on ai pricing tier record.
    pub tier_code: String,

    /// Tier label field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tier_label: Option<String>,

    /// Updated at field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai pricing tier record.
    pub uuid: String,

    /// Version field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Video unit price field on ai pricing tier record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video_unit_price: Option<String>,
}
