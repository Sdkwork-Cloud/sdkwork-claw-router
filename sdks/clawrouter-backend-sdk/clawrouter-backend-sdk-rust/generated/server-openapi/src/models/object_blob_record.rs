use serde::{Deserialize, Serialize};

/// Object blob record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ObjectBlobRecord {
    /// Bucket id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_id: Option<String>,

    /// Content sha 256 field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_sha256: Option<String>,

    /// Content type field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_type: Option<String>,

    /// Created at field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Encryption mode field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub encryption_mode: Option<String>,

    /// Id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Kms key ref field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub kms_key_ref: Option<String>,

    /// Last verified at field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<String>,

    /// Legal hold field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Object key field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_key: Option<String>,

    /// Organization id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Original filename field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub original_filename: Option<String>,

    /// Owner id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Physical size bytes field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub physical_size_bytes: Option<String>,

    /// Provider id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Retention until field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Size bytes field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub size_bytes: Option<String>,

    /// Status field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Storage class field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub storage_class: Option<String>,

    /// Storage etag field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub storage_etag: Option<String>,

    /// Tenant id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Version id field on object blob record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version_id: Option<String>,
}
