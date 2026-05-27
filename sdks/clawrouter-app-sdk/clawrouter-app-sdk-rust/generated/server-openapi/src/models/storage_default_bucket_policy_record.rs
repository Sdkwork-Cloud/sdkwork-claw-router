use serde::{Deserialize, Serialize};

/// Storage default bucket policy record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StorageDefaultBucketPolicyRecord {
    /// Bucket id field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_id: Option<String>,

    /// Bucket logical scope field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_logical_scope: Option<String>,

    /// Created at field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Logical scope field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub logical_scope: Option<String>,

    /// Metadata field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Reason field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,

    /// Request id field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Status field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Updated by field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,

    /// Uuid field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on storage default bucket policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
