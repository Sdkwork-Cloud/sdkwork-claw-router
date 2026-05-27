use serde::{Deserialize, Serialize};

/// Storage quota reservation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StorageQuotaReservationRecord {
    /// Created at field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Expires at field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Metadata field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Released at field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub released_at: Option<String>,

    /// Reservation no field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reservation_no: Option<String>,

    /// Scope id field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_id: Option<String>,

    /// Scope type field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_type: Option<String>,

    /// Status field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Upload session id field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upload_session_id: Option<String>,

    /// Uuid field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on storage quota reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
