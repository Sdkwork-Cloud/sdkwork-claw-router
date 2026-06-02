use serde::{Deserialize, Serialize};

/// Messaging send attempt record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingSendAttemptRecord {
    /// Attempt no field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attempt_no: Option<i64>,

    /// Attempted at field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attempted_at: Option<String>,

    /// Created at field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Failure code field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message masked field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message_masked: Option<String>,

    /// Http status field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub http_status: Option<i64>,

    /// Id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Latency ms field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<i64>,

    /// Legal hold field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider account id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider message id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_message_id: Option<String>,

    /// Provider request id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_request_id: Option<String>,

    /// Provider status field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_status: Option<String>,

    /// Request id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Retry after at field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_after_at: Option<String>,

    /// Send request id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub send_request_id: Option<String>,

    /// Status field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on messaging send attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
