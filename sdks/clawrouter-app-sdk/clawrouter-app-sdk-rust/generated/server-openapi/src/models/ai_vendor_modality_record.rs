use serde::{Deserialize, Serialize};

/// Ai vendor modality record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiVendorModalityRecord {
    /// Created at field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality code field on ai vendor modality record.
    pub modality_code: String,

    /// Modality id field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality_id: Option<String>,

    /// Organization id field on ai vendor modality record.
    pub organization_id: String,

    /// Sort order field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai vendor modality record.
    pub status: String,

    /// Supported field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supported: Option<bool>,

    /// Tenant id field on ai vendor modality record.
    pub tenant_id: String,

    /// Updated at field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai vendor modality record.
    pub uuid: String,

    /// Vendor code field on ai vendor modality record.
    pub vendor_code: String,

    /// Vendor id field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Version field on ai vendor modality record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
