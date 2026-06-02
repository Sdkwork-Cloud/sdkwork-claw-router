use serde::{Deserialize, Serialize};

/// Ai runtime invocation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRuntimeInvocationRecord {
    /// Agent run id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_id: Option<String>,

    /// Agent run step id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_step_id: Option<String>,

    /// Agent session id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Approval policy field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_policy: Option<String>,

    /// Attempt no field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attempt_no: Option<i64>,

    /// Chat item id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_item_id: Option<String>,

    /// Chat turn id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_turn_id: Option<String>,

    /// Completed at field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Conversation id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Cwd field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cwd: Option<String>,

    /// Endpoint field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint: Option<String>,

    /// Error code field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_code: Option<String>,

    /// Error message masked field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Error type field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_type: Option<String>,

    /// Exit code field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub exit_code: Option<String>,

    /// Finish reason field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub finish_reason: Option<String>,

    /// Id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Invocation no field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invocation_no: Option<String>,

    /// Invocation type field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invocation_type: Option<String>,

    /// Latency ms field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<String>,

    /// Legal hold field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Permission mode field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_mode: Option<String>,

    /// Provider field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Provider conversation id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_conversation_id: Option<String>,

    /// Provider response id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_response_id: Option<String>,

    /// Provider session id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_session_id: Option<String>,

    /// Provider step id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_step_id: Option<String>,

    /// Request id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Request json field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_json: Option<std::collections::HashMap<String, String>>,

    /// Response json field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_json: Option<std::collections::HashMap<String, String>>,

    /// Retention until field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Runtime field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Sandbox policy field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sandbox_policy: Option<String>,

    /// Started at field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Streaming field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub streaming: Option<bool>,

    /// Tenant id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tool call id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_call_id: Option<String>,

    /// Tool name field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_name: Option<String>,

    /// Trace id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Ttft ms field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ttft_ms: Option<String>,

    /// Usage json field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_json: Option<std::collections::HashMap<String, String>>,

    /// User id field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai runtime invocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
