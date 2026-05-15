use serde::{Deserialize, Serialize};

/// Ai pricing plan binding record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiPricingPlanBindingRecord {
    /// Binding source field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_source: Option<String>,

    /// Created at field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai pricing plan binding record.
    pub effective_from: String,

    /// Effective to field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Multiplier override field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub multiplier_override: Option<String>,

    /// Organization id field on ai pricing plan binding record.
    pub organization_id: String,

    /// Pricing plan code field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_plan_code: Option<String>,

    /// Pricing plan id field on ai pricing plan binding record.
    pub pricing_plan_id: String,

    /// Priority field on ai pricing plan binding record.
    pub priority: i64,

    /// Quota policy id field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_policy_id: Option<String>,

    /// Rpm override field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rpm_override: Option<String>,

    /// Status field on ai pricing plan binding record.
    pub status: String,

    /// Subject code field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_code: Option<String>,

    /// Subject id field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_id: Option<String>,

    /// Subject type field on ai pricing plan binding record.
    pub subject_type: String,

    /// Tenant id field on ai pricing plan binding record.
    pub tenant_id: String,

    /// Tpm override field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tpm_override: Option<String>,

    /// Updated at field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai pricing plan binding record.
    pub uuid: String,

    /// Version field on ai pricing plan binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
