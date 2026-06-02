use serde::{Deserialize, Serialize};

/// Ai mcp tool record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMcpToolRecord {
    /// Created at field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Discovered at field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub discovered_at: Option<String>,

    /// Enabled field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Id field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input schema field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_schema: Option<std::collections::HashMap<String, String>>,

    /// Last invoked at field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_invoked_at: Option<String>,

    /// Metadata field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output schema field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_schema: Option<std::collections::HashMap<String, String>>,

    /// Rate limit policy field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_limit_policy: Option<std::collections::HashMap<String, String>>,

    /// Requires approval field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requires_approval: Option<bool>,

    /// Risk level field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Schema hash field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub schema_hash: Option<String>,

    /// Server id field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub server_id: Option<String>,

    /// Server revision id field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub server_revision_id: Option<String>,

    /// Sort weight field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Status field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tool key field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_key: Option<String>,

    /// Updated at field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai mcp tool record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
