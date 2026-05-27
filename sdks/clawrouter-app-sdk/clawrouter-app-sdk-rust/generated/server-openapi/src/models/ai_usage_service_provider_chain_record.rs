use serde::{Deserialize, Serialize};

/// Ai usage service provider chain record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiUsageServiceProviderChainRecord {
    /// Chain depth field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chain_depth: Option<i64>,

    /// Chain hash field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chain_hash: Option<String>,

    /// Chain path snapshot field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chain_path_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Created at field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Leaf provider id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub leaf_provider_id: Option<String>,

    /// Legal hold field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Occurred at field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub occurred_at: Option<String>,

    /// Organization id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Resolved subject id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_subject_id: Option<String>,

    /// Resolved subject type field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_subject_type: Option<String>,

    /// Retention until field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Root provider id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub root_provider_id: Option<String>,

    /// Status field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage fact id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// User id field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai usage service provider chain record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
