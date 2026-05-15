use serde::{Deserialize, Serialize};

/// Ops inbox event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsInboxEventRecord {
    /// Consumer name field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consumer_name: Option<String>,

    /// Created at field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Event type field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_type: Option<String>,

    /// Event version field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_version: Option<i64>,

    /// Failure reason field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_reason: Option<String>,

    /// Id field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Message id field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,

    /// Metadata field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Process status field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub process_status: Option<String>,

    /// Processed at field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub processed_at: Option<String>,

    /// Request id field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Retry count field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_count: Option<i64>,

    /// Source system field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_system: Option<String>,

    /// Status field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops inbox event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
