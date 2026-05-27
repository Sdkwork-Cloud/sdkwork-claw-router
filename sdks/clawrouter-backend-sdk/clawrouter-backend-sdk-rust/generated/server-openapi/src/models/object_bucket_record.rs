use serde::{Deserialize, Serialize};

/// Object bucket record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ObjectBucketRecord {
    /// Bucket name field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_name: Option<String>,

    /// Bucket region field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_region: Option<String>,

    /// Created at field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data residency region field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_residency_region: Option<String>,

    /// Data scope field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Kms key ref field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub kms_key_ref: Option<String>,

    /// Logical scope field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub logical_scope: Option<String>,

    /// Metadata field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider id field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Request id field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Status field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
