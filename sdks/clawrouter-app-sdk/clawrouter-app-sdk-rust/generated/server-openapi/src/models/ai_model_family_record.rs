use serde::{Deserialize, Serialize};

/// Ai model family record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelFamilyRecord {
    /// Color token field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color_token: Option<String>,

    /// Created at field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default model field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_model: Option<String>,

    /// Default model id field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_model_id: Option<String>,

    /// Deleted at field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai model family record.
    pub display_name: String,

    /// Docs url field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Family code field on ai model family record.
    pub family_code: String,

    /// Family type field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub family_type: Option<String>,

    /// Icon url field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Id field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model count field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_count: Option<String>,

    /// Organization id field on ai model family record.
    pub organization_id: String,

    /// Primary modality field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub primary_modality: Option<String>,

    /// Region code field on ai model family record.
    pub region_code: String,

    /// Sort order field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai model family record.
    pub status: String,

    /// Tenant id field on ai model family record.
    pub tenant_id: String,

    /// Updated at field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model family record.
    pub uuid: String,

    /// Vendor code field on ai model family record.
    pub vendor_code: String,

    /// Vendor id field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Version field on ai model family record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
