use serde::{Deserialize, Serialize};

/// Storage gc job record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StorageGcJobRecord {
    /// Candidate count field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub candidate_count: Option<String>,

    /// Completed at field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Criteria json field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub criteria_json: Option<std::collections::HashMap<String, String>>,

    /// Cursor token field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cursor_token: Option<String>,

    /// Data scope field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Deleted object count field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_object_count: Option<String>,

    /// Dry run field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dry_run: Option<bool>,

    /// Id field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Job type field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub job_type: Option<String>,

    /// Metadata field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Released bytes field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub released_bytes: Option<String>,

    /// Request id field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Requested by field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_by: Option<String>,

    /// Result json field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result_json: Option<std::collections::HashMap<String, String>>,

    /// Started at field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on storage gc job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
