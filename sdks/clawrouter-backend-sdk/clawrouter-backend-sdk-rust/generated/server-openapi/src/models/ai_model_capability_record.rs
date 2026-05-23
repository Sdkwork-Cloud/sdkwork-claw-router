use serde::{Deserialize, Serialize};

/// Ai model capability record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelCapabilityRecord {
    /// Capability field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,

    /// Capability code field on ai model capability record.
    pub capability_code: String,

    /// Catalog key field on ai model capability record.
    pub catalog_key: String,

    /// Created at field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Endpoint formats field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_formats: Option<std::collections::HashMap<String, String>>,

    /// Id field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input modalities field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_modalities: Option<std::collections::HashMap<String, String>>,

    /// Limit unit field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub limit_unit: Option<String>,

    /// Limit value field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub limit_value: Option<String>,

    /// Metadata field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model field on ai model capability record.
    pub model: String,

    /// Model id field on ai model capability record.
    pub model_id: String,

    /// Organization id field on ai model capability record.
    pub organization_id: String,

    /// Output modalities field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_modalities: Option<std::collections::HashMap<String, String>>,

    /// Parameter name field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parameter_name: Option<String>,

    /// Parameter schema field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parameter_schema: Option<std::collections::HashMap<String, String>>,

    /// Schema version field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub schema_version: Option<String>,

    /// Sort order field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai model capability record.
    pub status: String,

    /// Supported field on ai model capability record.
    pub supported: bool,

    /// Tenant id field on ai model capability record.
    pub tenant_id: String,

    /// Updated at field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model capability record.
    pub uuid: String,

    /// Vendor code field on ai model capability record.
    pub vendor_code: String,

    /// Version field on ai model capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
