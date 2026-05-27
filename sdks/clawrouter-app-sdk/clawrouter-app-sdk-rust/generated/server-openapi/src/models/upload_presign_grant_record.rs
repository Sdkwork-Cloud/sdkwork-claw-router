use serde::{Deserialize, Serialize};

/// Upload presign grant record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UploadPresignGrantRecord {
    /// Bucket id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_id: Option<String>,

    /// Canonical headers field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub canonical_headers: Option<std::collections::HashMap<String, String>>,

    /// Consumed at field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consumed_at: Option<String>,

    /// Created at field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Expires at field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Method field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub method: Option<String>,

    /// Object key field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_key: Option<String>,

    /// Organization id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Request id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Signed headers field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub signed_headers: Option<std::collections::HashMap<String, String>>,

    /// Status field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Upload part id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upload_part_id: Option<String>,

    /// Upload session id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upload_session_id: Option<String>,

    /// User id field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on upload presign grant record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
