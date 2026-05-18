use serde::{Deserialize, Serialize};

/// Ai agent tool binding record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentToolBindingRecord {
    /// Agent id field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Agent version id field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_version_id: Option<String>,

    /// Binding key field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_key: Option<String>,

    /// Binding type field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_type: Option<String>,

    /// Created at field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential ref field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_ref: Option<String>,

    /// Data scope field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Enabled field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Health status field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last checked at field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_checked_at: Option<String>,

    /// Mcp server id field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mcp_server_id: Option<String>,

    /// Metadata field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Permission policy field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_policy: Option<std::collections::HashMap<String, String>>,

    /// Runtime config field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_config: Option<std::collections::HashMap<String, String>>,

    /// Skill id field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skill_id: Option<String>,

    /// Status field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tool name field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_name: Option<String>,

    /// Updated at field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai agent tool binding record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
