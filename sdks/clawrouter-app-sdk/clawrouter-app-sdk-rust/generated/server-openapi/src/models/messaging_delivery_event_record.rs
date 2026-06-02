use serde::{Deserialize, Serialize};

/// Messaging delivery event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingDeliveryEventRecord {
    /// Created at field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Event at field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_at: Option<String>,

    /// Event type field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_type: Option<String>,

    /// Id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Payload redacted field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_redacted: Option<std::collections::HashMap<String, String>>,

    /// Provider code field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider event id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_event_id: Option<String>,

    /// Provider message id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_message_id: Option<String>,

    /// Request id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Send attempt id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub send_attempt_id: Option<String>,

    /// Send request id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub send_request_id: Option<String>,

    /// Status field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on messaging delivery event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
