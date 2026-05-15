use serde::{Deserialize, Serialize};

/// Ops job execution record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsJobExecutionRecord {
    /// Created at field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Duration ms field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_ms: Option<String>,

    /// Ended at field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ended_at: Option<String>,

    /// Execution status field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub execution_status: Option<String>,

    /// Failure count field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_count: Option<String>,

    /// Failure reason field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_reason: Option<String>,

    /// Id field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Job name field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub job_name: Option<String>,

    /// Job type field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub job_type: Option<String>,

    /// Legal hold field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload: Option<std::collections::HashMap<String, String>>,

    /// Payload hash field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Processed count field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub processed_count: Option<String>,

    /// Request id field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Started at field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Success count field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub success_count: Option<String>,

    /// Tenant id field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Trigger type field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trigger_type: Option<String>,

    /// User id field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops job execution record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
