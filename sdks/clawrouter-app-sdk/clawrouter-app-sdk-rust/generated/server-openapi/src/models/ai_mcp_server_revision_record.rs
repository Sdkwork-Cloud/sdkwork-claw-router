use serde::{Deserialize, Serialize};

/// Ai mcp server revision record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMcpServerRevisionRecord {
    /// Args json field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub args_json: Option<std::collections::HashMap<String, String>>,

    /// Auth type field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Command field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub command: Option<String>,

    /// Config hash field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_hash: Option<String>,

    /// Created at field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Created by field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Data scope field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Deprecated at field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deprecated_at: Option<String>,

    /// Endpoint url field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_url: Option<String>,

    /// Env schema field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub env_schema: Option<std::collections::HashMap<String, String>>,

    /// Id field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Lifecycle status field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lifecycle_status: Option<String>,

    /// Metadata field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Retry policy field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<std::collections::HashMap<String, String>>,

    /// Revision no field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub revision_no: Option<String>,

    /// Secret ref field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Server id field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub server_id: Option<String>,

    /// Status field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Timeout ms field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Transport field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub transport: Option<String>,

    /// Updated at field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai mcp server revision record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
