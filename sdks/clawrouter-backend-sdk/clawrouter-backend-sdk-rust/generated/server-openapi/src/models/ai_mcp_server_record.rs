use serde::{Deserialize, Serialize};

/// Ai mcp server record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMcpServerRecord {
    /// Category code field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_code: Option<String>,

    /// Category id field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Created at field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Deprecated at field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Description field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Health status field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last checked at field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_checked_at: Option<String>,

    /// Last error masked field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_error_masked: Option<String>,

    /// Latest revision id field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_revision_id: Option<String>,

    /// Metadata field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Published at field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Published revision id field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_revision_id: Option<String>,

    /// Server key field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub server_key: Option<String>,

    /// Status field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tags field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Transport field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub transport: Option<String>,

    /// Updated at field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Visibility field on ai mcp server record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
}
