use serde::{Deserialize, Serialize};

/// Upload session record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UploadSessionRecord {
    /// Aborted at field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aborted_at: Option<String>,

    /// Bucket id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_id: Option<String>,

    /// Completed at field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Completed bytes field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_bytes: Option<String>,

    /// Completed part count field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_part_count: Option<i64>,

    /// Content type field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_type: Option<String>,

    /// Created at field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Expected sha 256 field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expected_sha256: Option<String>,

    /// Expected size bytes field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expected_size_bytes: Option<String>,

    /// Expires at field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Logical scope field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub logical_scope: Option<String>,

    /// Metadata field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Object key field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_key: Option<String>,

    /// Organization id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Original filename field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub original_filename: Option<String>,

    /// Owner id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Part count field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub part_count: Option<i64>,

    /// Part size bytes field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub part_size_bytes: Option<String>,

    /// Provider id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Request id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// S 3 upload id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub s3_upload_id: Option<String>,

    /// Status field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Upload mode field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upload_mode: Option<String>,

    /// Upload session no field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upload_session_no: Option<String>,

    /// User id field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on upload session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
