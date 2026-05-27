use serde::{Deserialize, Serialize};

/// Storage reconciliation item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StorageReconciliationItemRecord {
    /// Actual hash field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actual_hash: Option<String>,

    /// Actual size bytes field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actual_size_bytes: Option<String>,

    /// Bucket id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_id: Option<String>,

    /// Created at field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Expected hash field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expected_hash: Option<String>,

    /// Expected size bytes field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expected_size_bytes: Option<String>,

    /// Id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Issue type field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub issue_type: Option<String>,

    /// Legal hold field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Object blob id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_blob_id: Option<String>,

    /// Object key field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_key: Option<String>,

    /// Organization id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Repair payload field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repair_payload: Option<std::collections::HashMap<String, String>>,

    /// Repair status field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repair_status: Option<String>,

    /// Request id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Run id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_id: Option<String>,

    /// Status field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on storage reconciliation item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
