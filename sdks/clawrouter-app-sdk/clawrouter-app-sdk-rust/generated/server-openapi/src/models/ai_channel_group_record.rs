use serde::{Deserialize, Serialize};

/// Ai channel group record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelGroupRecord {
    /// Allowed origin field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub allowed_origin: Option<std::collections::HashMap<String, String>>,

    /// Billing type field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_type: Option<String>,

    /// Capacity limit field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capacity_limit: Option<String>,

    /// Created at field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Environment field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Group code field on ai channel group record.
    pub group_code: String,

    /// Group name field on ai channel group record.
    pub group_name: String,

    /// Group type field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_type: Option<String>,

    /// Id field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Official price multiplier field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub official_price_multiplier: Option<String>,

    /// Organization id field on ai channel group record.
    pub organization_id: String,

    /// Price reference mode field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_reference_mode: Option<String>,

    /// Pricing plan code field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_code: Option<String>,

    /// Pricing plan id field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_id: Option<String>,

    /// Provider code field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Quota policy id field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_policy_id: Option<String>,

    /// Rate limit policy id field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_limit_policy_id: Option<String>,

    /// Rate multiplier field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_multiplier: Option<String>,

    /// Routing policy id field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub routing_policy_id: Option<String>,

    /// Status field on ai channel group record.
    pub status: String,

    /// Tenant id field on ai channel group record.
    pub tenant_id: String,

    /// Updated at field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai channel group record.
    pub uuid: String,

    /// Version field on ai channel group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
