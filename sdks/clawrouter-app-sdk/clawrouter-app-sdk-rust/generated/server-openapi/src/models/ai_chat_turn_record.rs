use serde::{Deserialize, Serialize};

/// Ai chat turn record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChatTurnRecord {
    /// Agent id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Agent session id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Branch id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub branch_id: Option<String>,

    /// Cached token total field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_token_total: Option<String>,

    /// Completed at field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Context snapshot id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub context_snapshot_id: Option<String>,

    /// Conversation id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Cost amount field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_amount: Option<String>,

    /// Created at field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Endpoint field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint: Option<String>,

    /// Final output item id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub final_output_item_id: Option<String>,

    /// Id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input item id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_item_id: Option<String>,

    /// Input token total field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_token_total: Option<String>,

    /// Legal hold field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output token total field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_token_total: Option<String>,

    /// Parent turn id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_turn_id: Option<String>,

    /// Payload hash field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Reasoning token total field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reasoning_token_total: Option<String>,

    /// Request id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Request snapshot field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Response snapshot field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Retention until field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Runtime invocation id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Started at field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Streaming field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub streaming: Option<bool>,

    /// Tenant id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Turn no field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub turn_no: Option<String>,

    /// Usage snapshot field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_snapshot: Option<std::collections::HashMap<String, String>>,

    /// User id field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai chat turn record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
