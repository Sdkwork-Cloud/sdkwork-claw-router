use serde::{Deserialize, Serialize};

/// Commerce usage pricing plan record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsagePricingPlanRecord {
    /// Created at field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Included quota field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub included_quota: Option<String>,

    /// Metadata field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Overage pricing id field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub overage_pricing_id: Option<String>,

    /// Plan code field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan_code: Option<String>,

    /// Plan name field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan_name: Option<String>,

    /// Pricing mode field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_mode: Option<String>,

    /// Product id field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub product_id: Option<String>,

    /// Rate multiplier field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_multiplier: Option<String>,

    /// Sku id field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sku_id: Option<String>,

    /// Status field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Vip level id field on commerce usage pricing plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vip_level_id: Option<String>,
}
