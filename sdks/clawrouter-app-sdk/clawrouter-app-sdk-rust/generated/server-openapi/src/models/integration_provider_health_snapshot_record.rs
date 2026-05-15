use serde::{Deserialize, Serialize};

/// Integration provider health snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationProviderHealthSnapshotRecord {
    /// Channel id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Check type field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub check_type: Option<String>,

    /// Checked at field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checked_at: Option<String>,

    /// Created at field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Error code field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_code: Option<String>,

    /// Error message masked field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Health status field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Http status field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub http_status: Option<i64>,

    /// Id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Latency ms field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<i64>,

    /// Legal hold field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider account id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Quota snapshot field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Request id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Status field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on integration provider health snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
