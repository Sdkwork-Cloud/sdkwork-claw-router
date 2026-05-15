use serde::{Deserialize, Serialize};

/// Ai pricing rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiPricingRuleRecord {
    /// Billing meter code field on ai pricing rule record.
    pub billing_meter_code: String,

    /// Billing meter id field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_id: Option<String>,

    /// Billing mode field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_mode: Option<String>,

    /// Billing type field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_type: Option<String>,

    /// Capability code field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability_code: Option<String>,

    /// Channel id field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Created at field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai pricing rule record.
    pub effective_from: String,

    /// Effective to field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Expression field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expression: Option<String>,

    /// Expression hash field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expression_hash: Option<String>,

    /// Fallback mode field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_mode: Option<String>,

    /// Family code field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub family_code: Option<String>,

    /// Formula mode field on ai pricing rule record.
    pub formula_mode: String,

    /// Id field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Included quantity field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub included_quantity: Option<String>,

    /// Markup amount field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub markup_amount: Option<String>,

    /// Match type field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub match_type: Option<String>,

    /// Metadata field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metering mode field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metering_mode: Option<String>,

    /// Minimum quantity field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub minimum_quantity: Option<String>,

    /// Model field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Model id field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Multiplier field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub multiplier: Option<String>,

    /// Organization id field on ai pricing rule record.
    pub organization_id: String,

    /// Platform code field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub platform_code: Option<String>,

    /// Price item type field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_item_type: Option<String>,

    /// Price side field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_side: Option<String>,

    /// Pricing plan code field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_code: Option<String>,

    /// Pricing plan id field on ai pricing rule record.
    pub pricing_plan_id: String,

    /// Priority field on ai pricing rule record.
    pub priority: i64,

    /// Provider code field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider model field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Quantity formula field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_formula: Option<String>,

    /// Quantity source field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_source: Option<String>,

    /// Quantity step field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quantity_step: Option<String>,

    /// Reference price side field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_price_side: Option<String>,

    /// Reference pricing id field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_pricing_id: Option<String>,

    /// Reference pricing scope field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_pricing_scope: Option<String>,

    /// Region field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,

    /// Result selector field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result_selector: Option<String>,

    /// Rule code field on ai pricing rule record.
    pub rule_code: String,

    /// Rule name field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_name: Option<String>,

    /// Service tier field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub service_tier: Option<String>,

    /// Status field on ai pricing rule record.
    pub status: String,

    /// Tenant id field on ai pricing rule record.
    pub tenant_id: String,

    /// Unit field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit: Option<String>,

    /// Unit price override field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit_price_override: Option<String>,

    /// Unit size field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit_size: Option<String>,

    /// Updated at field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai pricing rule record.
    pub uuid: String,

    /// Vendor code field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Version field on ai pricing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
