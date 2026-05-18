use serde::{Deserialize, Serialize};

/// Ai agent version record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentVersionRecord {
    /// Agent id field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Config hash field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_hash: Option<String>,

    /// Created at field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Mcp policy field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mcp_policy: Option<std::collections::HashMap<String, String>>,

    /// Memory policy field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_policy: Option<std::collections::HashMap<String, String>>,

    /// Metadata field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model policy field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_policy: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Published by field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_by: Option<String>,

    /// Release status field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_status: Option<String>,

    /// Runtime policy field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_policy: Option<std::collections::HashMap<String, String>>,

    /// Skill policy field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skill_policy: Option<std::collections::HashMap<String, String>>,

    /// Status field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// System prompt field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub system_prompt: Option<String>,

    /// Tenant id field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tool policy field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_policy: Option<std::collections::HashMap<String, String>>,

    /// Updated at field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version no field on ai agent version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_no: Option<String>,
}
