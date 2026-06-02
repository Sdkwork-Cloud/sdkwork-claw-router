use serde::{Deserialize, Serialize};

/// Ai runtime usage link record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRuntimeUsageLinkRecord {
    /// Agent run id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_id: Option<String>,

    /// Agent run step id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_step_id: Option<String>,

    /// Agent run step id key field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_step_id_key: Option<String>,

    /// Agent session id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Cached tokens field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_tokens: Option<String>,

    /// Chat item id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_item_id: Option<String>,

    /// Chat turn id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_turn_id: Option<String>,

    /// Conversation id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Cost amount field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_amount: Option<String>,

    /// Created at field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input tokens field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_tokens: Option<String>,

    /// Legal hold field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Message id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,

    /// Metadata field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Occurred at field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub occurred_at: Option<String>,

    /// Organization id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output tokens field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_tokens: Option<String>,

    /// Payload hash field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Reasoning tokens field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reasoning_tokens: Option<String>,

    /// Request id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Runtime invocation id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Status field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total tokens field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<String>,

    /// Trace id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage fact id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// Usage type field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_type: Option<String>,

    /// User id field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai runtime usage link record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
