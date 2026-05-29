use serde::{Deserialize, Serialize};

/// Ai model api endpoint record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelApiEndpointRecord {
    /// Api endpoint id field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_endpoint_id: Option<String>,

    /// Catalog key field on ai model api endpoint record.
    pub catalog_key: String,

    /// Created at field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default parameters field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_parameters: Option<std::collections::HashMap<String, String>>,

    /// Deleted at field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Endpoint code field on ai model api endpoint record.
    pub endpoint_code: String,

    /// Id field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Model id field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Organization id field on ai model api endpoint record.
    pub organization_id: String,

    /// Provider native model field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_model: Option<String>,

    /// Sort order field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai model api endpoint record.
    pub status: String,

    /// Supported field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported: Option<bool>,

    /// Supports streaming field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_streaming: Option<bool>,

    /// Tenant id field on ai model api endpoint record.
    pub tenant_id: String,

    /// Updated at field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model api endpoint record.
    pub uuid: String,

    /// Vendor code field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Version field on ai model api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
