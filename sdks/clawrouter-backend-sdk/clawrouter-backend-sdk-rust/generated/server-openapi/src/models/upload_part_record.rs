use serde::{Deserialize, Serialize};

/// Upload part record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UploadPartRecord {
    /// Created at field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Part etag field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub part_etag: Option<String>,

    /// Part number field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub part_number: Option<i64>,

    /// Part sha 256 field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub part_sha256: Option<String>,

    /// Presigned url expires at field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub presigned_url_expires_at: Option<String>,

    /// Status field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Upload session id field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upload_session_id: Option<String>,

    /// Uploaded at field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uploaded_at: Option<String>,

    /// Uuid field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on upload part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
