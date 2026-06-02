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

    /// Default encryption mode field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_encryption_mode: Option<String>,

    /// Default storage class field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_storage_class: Option<String>,

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

    /// Lifecycle enabled field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lifecycle_enabled: Option<bool>,

    /// Logical scope field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub logical_scope: Option<String>,

    /// Metadata field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Object key prefix field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_key_prefix: Option<String>,

    /// Object lock enabled field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_lock_enabled: Option<bool>,

    /// Organization id field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider id field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Public access blocked field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub public_access_blocked: Option<bool>,

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

    /// Versioning enabled field on object bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub versioning_enabled: Option<bool>,
}
