use serde::{Deserialize, Serialize};

/// Ai modality api endpoint record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModalityApiEndpointRecord {
    /// Api endpoint id field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_endpoint_id: Option<String>,

    /// Created at field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Endpoint code field on ai modality api endpoint record.
    pub endpoint_code: String,

    /// Id field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality code field on ai modality api endpoint record.
    pub modality_code: String,

    /// Modality id field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality_id: Option<String>,

    /// Organization id field on ai modality api endpoint record.
    pub organization_id: String,

    /// Sort order field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai modality api endpoint record.
    pub status: String,

    /// Supported field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported: Option<bool>,

    /// Tenant id field on ai modality api endpoint record.
    pub tenant_id: String,

    /// Updated at field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai modality api endpoint record.
    pub uuid: String,

    /// Version field on ai modality api endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
