use serde::{Deserialize, Serialize};

/// Iam gateway api key group record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamGatewayApiKeyGroupRecord {
    /// Allowed origin field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub allowed_origin: Option<std::collections::HashMap<String, String>>,

    /// Billing type field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_type: Option<String>,

    /// Capacity limit field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capacity_limit: Option<String>,

    /// Code field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Created at field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default policy id field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_policy_id: Option<String>,

    /// Default quota policy id field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_quota_policy_id: Option<String>,

    /// Deleted at field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Environment field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Group type field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_type: Option<String>,

    /// Id field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Official price multiplier field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub official_price_multiplier: Option<String>,

    /// Organization id field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Price reference mode field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_reference_mode: Option<String>,

    /// Pricing plan code field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_code: Option<String>,

    /// Pricing plan id field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_id: Option<String>,

    /// Provider code field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rate multiplier field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_multiplier: Option<String>,

    /// Status field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on iam gateway api key group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
