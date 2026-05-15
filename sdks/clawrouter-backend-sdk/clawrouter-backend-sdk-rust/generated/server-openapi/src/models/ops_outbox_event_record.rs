use serde::{Deserialize, Serialize};

/// Ops outbox event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsOutboxEventRecord {
    /// Aggregate id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aggregate_id: Option<String>,

    /// Aggregate type field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aggregate_type: Option<String>,

    /// Aggregate uuid field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub aggregate_uuid: Option<String>,

    /// Created at field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Event id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_id: Option<String>,

    /// Event payload field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_payload: Option<std::collections::HashMap<String, String>>,

    /// Event type field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_type: Option<String>,

    /// Event version field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_version: Option<i64>,

    /// Failure reason field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_reason: Option<String>,

    /// Headers field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub headers: Option<std::collections::HashMap<String, String>>,

    /// Id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Next retry at field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub next_retry_at: Option<String>,

    /// Organization id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Publish status field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publish_status: Option<String>,

    /// Published at field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Request id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Retry count field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_count: Option<i64>,

    /// Status field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops outbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
