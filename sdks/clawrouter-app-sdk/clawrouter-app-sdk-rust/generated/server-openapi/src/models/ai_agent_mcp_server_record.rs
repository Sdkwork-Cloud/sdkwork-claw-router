use serde::{Deserialize, Serialize};

/// Ai agent mcp server record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentMcpServerRecord {
    /// Connection config field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub connection_config: Option<std::collections::HashMap<String, String>>,

    /// Created at field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential ref field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_ref: Option<String>,

    /// Data scope field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Health status field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last checked at field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_checked_at: Option<String>,

    /// Last error masked field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_error_masked: Option<String>,

    /// Metadata field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Permission policy field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_policy: Option<std::collections::HashMap<String, String>>,

    /// Prompt catalog field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_catalog: Option<std::collections::HashMap<String, String>>,

    /// Resource catalog field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_catalog: Option<std::collections::HashMap<String, String>>,

    /// Server code field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub server_code: Option<String>,

    /// Status field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tool catalog field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_catalog: Option<std::collections::HashMap<String, String>>,

    /// Transport type field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub transport_type: Option<String>,

    /// Updated at field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai agent mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
