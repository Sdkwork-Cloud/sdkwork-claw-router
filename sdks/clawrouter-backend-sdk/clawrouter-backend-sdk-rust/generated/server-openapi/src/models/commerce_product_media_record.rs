use serde::{Deserialize, Serialize};

/// Commerce product media record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductMediaRecord {
    /// Alt text field on commerce product media record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,

    /// Created at field on commerce product media record.
    pub created_at: String,

    /// Id field on commerce product media record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Media resource id field on commerce product media record.
    pub media_resource_id: String,

    /// Media role field on commerce product media record.
    pub media_role: String,

    /// Object blob id field on commerce product media record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_blob_id: Option<String>,

    /// Organization id field on commerce product media record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on commerce product media record.
    pub owner_id: String,

    /// Owner type field on commerce product media record.
    pub owner_type: String,

    /// Resource snapshot field on commerce product media record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Sort order field on commerce product media record.
    pub sort_order: String,

    /// Status field on commerce product media record.
    pub status: String,

    /// Tenant id field on commerce product media record.
    pub tenant_id: String,

    /// Updated at field on commerce product media record.
    pub updated_at: String,
}
