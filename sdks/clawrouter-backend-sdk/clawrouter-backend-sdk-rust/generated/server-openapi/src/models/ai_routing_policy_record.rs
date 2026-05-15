use serde::{Deserialize, Serialize};

/// Ai routing policy record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRoutingPolicyRecord {
    /// Capability field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,

    /// Cost ceiling field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_ceiling: Option<String>,

    /// Created at field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data scope field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default profile id field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_profile_id: Option<String>,

    /// Deleted at field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Fallback mode field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_mode: Option<String>,

    /// Id field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Policy code field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_code: Option<String>,

    /// Policy scope field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_scope: Option<String>,

    /// Slo latency ms field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub slo_latency_ms: Option<i64>,

    /// Slo success rate field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub slo_success_rate: Option<String>,

    /// Status field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Subject id field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_id: Option<String>,

    /// Tenant id field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai routing policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
