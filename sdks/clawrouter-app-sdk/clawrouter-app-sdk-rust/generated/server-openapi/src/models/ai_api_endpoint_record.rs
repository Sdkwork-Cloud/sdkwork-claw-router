use serde::{Deserialize, Serialize};

/// Ai api endpoint record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiApiEndpointRecord {
    /// Created at field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Display name field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Endpoint code field on ai api endpoint record.
    pub endpoint_code: String,

    /// Id field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Method field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub method: Option<String>,

    /// Organization id field on ai api endpoint record.
    pub organization_id: String,

    /// Path template field on ai api endpoint record.
    pub path_template: String,

    /// Protocol code field on ai api endpoint record.
    pub protocol_code: String,

    /// Request schema field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_schema: Option<std::collections::HashMap<String, String>>,

    /// Response schema field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_schema: Option<std::collections::HashMap<String, String>>,

    /// Sort order field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai api endpoint record.
    pub status: String,

    /// Streaming supported field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub streaming_supported: Option<bool>,

    /// Tenant id field on ai api endpoint record.
    pub tenant_id: String,

    /// Updated at field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai api endpoint record.
    pub uuid: String,

    /// Version field on ai api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
