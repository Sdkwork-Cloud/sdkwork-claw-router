use serde::{Deserialize, Serialize};

/// Iam gateway access policy record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamGatewayAccessPolicyRecord {
    /// Allowed capabilities field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub allowed_capabilities: Option<std::collections::HashMap<String, String>>,

    /// Allowed models field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub allowed_models: Option<std::collections::HashMap<String, String>>,

    /// Created at field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data retention mode field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_retention_mode: Option<String>,

    /// Data scope field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Denied capabilities field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub denied_capabilities: Option<std::collections::HashMap<String, String>>,

    /// Denied models field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub denied_models: Option<std::collections::HashMap<String, String>>,

    /// Effective from field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Ip allowlist field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_allowlist: Option<std::collections::HashMap<String, String>>,

    /// Ip denylist field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_denylist: Option<std::collections::HashMap<String, String>>,

    /// Ip rule count field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_rule_count: Option<i64>,

    /// Max context tokens field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_context_tokens: Option<String>,

    /// Metadata field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Network policy mode field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub network_policy_mode: Option<String>,

    /// Organization id field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Policy type field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_type: Option<String>,

    /// Region allowlist field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_allowlist: Option<std::collections::HashMap<String, String>>,

    /// Status field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Subject id field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_id: Option<String>,

    /// Subject ref hash field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_ref_hash: Option<String>,

    /// Subject ref masked field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_ref_masked: Option<String>,

    /// Subject type field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_type: Option<String>,

    /// Tenant id field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on iam gateway access policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
