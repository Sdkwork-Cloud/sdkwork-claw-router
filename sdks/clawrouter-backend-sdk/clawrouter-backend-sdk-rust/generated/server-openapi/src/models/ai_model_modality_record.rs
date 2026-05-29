use serde::{Deserialize, Serialize};

/// Ai model modality record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelModalityRecord {
    /// Catalog key field on ai model modality record.
    pub catalog_key: String,

    /// Created at field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Direction field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direction: Option<String>,

    /// Id field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality code field on ai model modality record.
    pub modality_code: String,

    /// Modality id field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality_id: Option<String>,

    /// Model field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Model id field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Organization id field on ai model modality record.
    pub organization_id: String,

    /// Sort order field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai model modality record.
    pub status: String,

    /// Supported field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported: Option<bool>,

    /// Tenant id field on ai model modality record.
    pub tenant_id: String,

    /// Updated at field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model modality record.
    pub uuid: String,

    /// Vendor code field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Version field on ai model modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
