use serde::{Deserialize, Serialize};

/// Ai routing decision log record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRoutingDecisionLogRecord {
    /// Api key id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_id: Option<String>,

    /// Candidate snapshot field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub candidate_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Capability field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,

    /// Created at field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Decision latency ms field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub decision_latency_ms: Option<i64>,

    /// Decision mode field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub decision_mode: Option<String>,

    /// Decision reason field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub decision_reason: Option<std::collections::HashMap<String, String>>,

    /// Fallback chain field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_chain: Option<std::collections::HashMap<String, String>>,

    /// Id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legacy api key id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legacy_api_key_id: Option<String>,

    /// Legal hold field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Policy id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_id: Option<String>,

    /// Profile id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub profile_id: Option<String>,

    /// Request id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Requested model field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_model: Option<String>,

    /// Resolved model field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_model: Option<String>,

    /// Retention until field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Rule id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_id: Option<String>,

    /// Selected account id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selected_account_id: Option<String>,

    /// Selected channel id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selected_channel_id: Option<String>,

    /// Selected provider id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selected_provider_id: Option<String>,

    /// Status field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai routing decision log record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
