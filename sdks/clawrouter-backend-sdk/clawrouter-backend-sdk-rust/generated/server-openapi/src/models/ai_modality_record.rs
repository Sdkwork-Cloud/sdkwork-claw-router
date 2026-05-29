use serde::{Deserialize, Serialize};

/// Ai modality record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModalityRecord {
    /// Created at field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai modality record.
    pub display_name: String,

    /// Id field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input supported field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_supported: Option<bool>,

    /// Metadata field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality code field on ai modality record.
    pub modality_code: String,

    /// Modality group field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality_group: Option<String>,

    /// Organization id field on ai modality record.
    pub organization_id: String,

    /// Output supported field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_supported: Option<bool>,

    /// Sort order field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai modality record.
    pub status: String,

    /// Tenant id field on ai modality record.
    pub tenant_id: String,

    /// Updated at field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai modality record.
    pub uuid: String,

    /// Version field on ai modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
