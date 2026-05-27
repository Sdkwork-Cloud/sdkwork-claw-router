use serde::{Deserialize, Serialize};

/// Storage reconciliation run record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StorageReconciliationRunRecord {
    /// Bucket id field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_id: Option<String>,

    /// Check mode field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub check_mode: Option<String>,

    /// Completed at field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Metadata field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider id field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Request id field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Requested by field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_by: Option<String>,

    /// Run type field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_type: Option<String>,

    /// Status field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on storage reconciliation run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
