use serde::{Deserialize, Serialize};

/// Ai request trace record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRequestTraceRecord {
    /// Api key id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_id: Option<String>,

    /// Api key name snapshot field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_key_name_snapshot: Option<String>,

    /// Attempt no field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attempt_no: Option<i64>,

    /// Cached tokens field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_tokens: Option<String>,

    /// Channel group id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_id: Option<String>,

    /// Channel group snapshot field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_snapshot: Option<String>,

    /// Channel id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Channel name snapshot field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_name_snapshot: Option<String>,

    /// Client ip hash field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_hash: Option<String>,

    /// Client ip masked field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_masked: Option<String>,

    /// Client ip region field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_region: Option<String>,

    /// Completion tokens field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completion_tokens: Option<String>,

    /// Created at field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Decision log id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub decision_log_id: Option<String>,

    /// Ended at field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ended_at: Option<String>,

    /// Endpoint field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint: Option<String>,

    /// Error message masked field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Error type field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_type: Option<String>,

    /// Http method field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub http_method: Option<String>,

    /// Http status field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub http_status: Option<i64>,

    /// Id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Latency ms field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<i64>,

    /// Legacy api key id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legacy_api_key_id: Option<String>,

    /// Legal hold field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner name snapshot field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_name_snapshot: Option<String>,

    /// Owner type field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Payload hash field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Prompt tokens field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_tokens: Option<String>,

    /// Provider error code field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_error_code: Option<String>,

    /// Provider id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Provider model field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_model: Option<String>,

    /// Provider native model field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_model: Option<String>,

    /// Reasoning effort field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reasoning_effort: Option<String>,

    /// Request bytes field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_bytes: Option<String>,

    /// Request id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Request path field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_path: Option<String>,

    /// Request payload hash field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_payload_hash: Option<String>,

    /// Requested model field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_model: Option<String>,

    /// Requested model catalog key field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_model_catalog_key: Option<String>,

    /// Response bytes field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_bytes: Option<String>,

    /// Response payload hash field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_payload_hash: Option<String>,

    /// Retention until field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Started at field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Streaming field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub streaming: Option<bool>,

    /// Tenant id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total tokens field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<String>,

    /// Trace id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Ttft ms field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ttft_ms: Option<i64>,

    /// User agent hash field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent_hash: Option<String>,

    /// User id field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai request trace record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
