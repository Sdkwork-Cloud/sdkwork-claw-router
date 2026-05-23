use serde::{Deserialize, Serialize};

/// Ai runtime invocation event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRuntimeInvocationEventRecord {
    /// Agent run id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_id: Option<String>,

    /// Agent run step id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_step_id: Option<String>,

    /// Agent session id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Chat turn id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_turn_id: Option<String>,

    /// Conversation id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Event no field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_no: Option<String>,

    /// Event source field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_source: Option<String>,

    /// Event type field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_type: Option<String>,

    /// Id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Invocation id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invocation_id: Option<String>,

    /// Legal hold field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Payload json field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_json: Option<std::collections::HashMap<String, String>>,

    /// Request id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Status field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Text delta field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub text_delta: Option<String>,

    /// Trace id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai runtime invocation event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
