use serde::{Deserialize, Serialize};

/// Media resource record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MediaResourceRecord {
    /// Access json field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_json: Option<std::collections::HashMap<String, String>>,

    /// Ai json field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ai_json: Option<std::collections::HashMap<String, String>>,

    /// Alt text field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,

    /// Bucket id field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_id: Option<String>,

    /// Checksum json field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checksum_json: Option<std::collections::HashMap<String, String>>,

    /// Created at field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Duration seconds field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<String>,

    /// File name field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_name: Option<String>,

    /// Height field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub height: Option<i64>,

    /// Id field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Kind field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub kind: Option<String>,

    /// Media resource no field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub media_resource_no: Option<String>,

    /// Metadata field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mime type field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Object blob id field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_blob_id: Option<String>,

    /// Object key field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_key: Option<String>,

    /// Object version field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_version: Option<String>,

    /// Organization id field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Renditions json field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub renditions_json: Option<std::collections::HashMap<String, String>>,

    /// Size bytes field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub size_bytes: Option<String>,

    /// Source field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    /// Status field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uri field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uri: Option<String>,

    /// User id field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Width field on media resource record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub width: Option<i64>,
}
