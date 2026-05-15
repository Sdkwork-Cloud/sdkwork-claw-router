use serde::{Deserialize, Serialize};

/// Ai pricing plan record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiPricingPlanRecord {
    /// Base price side field on ai pricing plan record.
    pub base_price_side: String,

    /// Base pricing scope field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_pricing_scope: Option<String>,

    /// Billing mode field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_mode: Option<String>,

    /// Created at field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai pricing plan record.
    pub currency: String,

    /// Data scope field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default markup amount field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_markup_amount: Option<String>,

    /// Default multiplier field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_multiplier: Option<String>,

    /// Default reference price id field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_reference_price_id: Option<String>,

    /// Deleted at field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Effective from field on ai pricing plan record.
    pub effective_from: String,

    /// Effective to field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Fallback mode field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_mode: Option<String>,

    /// Id field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Min charge amount field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub min_charge_amount: Option<String>,

    /// Organization id field on ai pricing plan record.
    pub organization_id: String,

    /// Plan code field on ai pricing plan record.
    pub plan_code: String,

    /// Plan name field on ai pricing plan record.
    pub plan_name: String,

    /// Plan scope field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan_scope: Option<String>,

    /// Price version field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_version: Option<String>,

    /// Priority field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Rounding mode field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rounding_mode: Option<String>,

    /// Status field on ai pricing plan record.
    pub status: String,

    /// Tenant id field on ai pricing plan record.
    pub tenant_id: String,

    /// Updated at field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai pricing plan record.
    pub uuid: String,

    /// Version field on ai pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
