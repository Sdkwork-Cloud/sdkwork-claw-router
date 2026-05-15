use serde::{Deserialize, Serialize};

/// Ops alert event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsAlertEventRecord {
    /// Alert no field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alert_no: Option<String>,

    /// Alert status field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alert_status: Option<String>,

    /// Created at field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// First seen at field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub first_seen_at: Option<String>,

    /// Id field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last seen at field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_seen_at: Option<String>,

    /// Legal hold field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Message field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Metadata field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Resolved at field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_at: Option<String>,

    /// Resolved by field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_by: Option<String>,

    /// Retention until field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Severity field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub severity: Option<String>,

    /// Source field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    /// Status field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Trace id field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops alert event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
