use serde::{Deserialize, Serialize};

/// Ai memory link record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMemoryLinkRecord {
    /// Agent run id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_id: Option<String>,

    /// Agent run step id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_step_id: Option<String>,

    /// Agent session id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Chat item id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_item_id: Option<String>,

    /// Chat turn id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_turn_id: Option<String>,

    /// Conversation id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Injected text snapshot field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub injected_text_snapshot: Option<String>,

    /// Legal hold field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Link type field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub link_type: Option<String>,

    /// Memory id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_id: Option<String>,

    /// Memory space id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Message id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,

    /// Metadata field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Policy decision field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_decision: Option<String>,

    /// Recall query field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recall_query: Option<String>,

    /// Recall rank field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recall_rank: Option<i64>,

    /// Recall score field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recall_score: Option<String>,

    /// Request id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Runtime invocation id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Status field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token count field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_count: Option<String>,

    /// Trace id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai memory link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
