use serde::{Deserialize, Serialize};

/// Ai resource record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiResourceRecord {
    /// Api code field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_code: Option<String>,

    /// Api endpoint id field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_endpoint_id: Option<String>,

    /// Catalog key field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_key: Option<String>,

    /// Created at field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Id field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metadata schema field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_schema: Option<std::collections::HashMap<String, String>>,

    /// Modality code field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality_code: Option<String>,

    /// Modality id field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality_id: Option<String>,

    /// Model field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Model code field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_code: Option<String>,

    /// Model id field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Organization id field on ai resource record.
    pub organization_id: String,

    /// Provider native model field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_model: Option<String>,

    /// Resource code field on ai resource record.
    pub resource_code: String,

    /// Resource schema field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_schema: Option<std::collections::HashMap<String, String>>,

    /// Resource type field on ai resource record.
    pub resource_type: String,

    /// Sort order field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai resource record.
    pub status: String,

    /// Tenant id field on ai resource record.
    pub tenant_id: String,

    /// Updated at field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai resource record.
    pub uuid: String,

    /// Vendor code field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Vendor id field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Version field on ai resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
