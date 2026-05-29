use serde::{Deserialize, Serialize};

/// Ai provider record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiProviderRecord {
    /// Auth type field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Base url field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Color token field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color_token: Option<String>,

    /// Created at field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default vendor code field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_vendor_code: Option<String>,

    /// Deleted at field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai provider record.
    pub display_name: String,

    /// Docs url field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Icon url field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Id field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metadata schema version field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_schema_version: Option<String>,

    /// Organization id field on ai provider record.
    pub organization_id: String,

    /// Protocol code field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol_code: Option<String>,

    /// Provider code field on ai provider record.
    pub provider_code: String,

    /// Provider type field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_type: Option<String>,

    /// Resource schema field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_schema: Option<std::collections::HashMap<String, String>>,

    /// Sort order field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai provider record.
    pub status: String,

    /// Tenant id field on ai provider record.
    pub tenant_id: String,

    /// Updated at field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai provider record.
    pub uuid: String,

    /// Version field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Website url field on ai provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website_url: Option<String>,
}
