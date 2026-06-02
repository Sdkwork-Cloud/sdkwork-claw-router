use serde::{Deserialize, Serialize};

/// Ai chat message record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChatMessageRecord {
    /// Content json field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_json: Option<std::collections::HashMap<String, String>>,

    /// Content text field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_text: Option<String>,

    /// Conversation id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Direction field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direction: Option<String>,

    /// Finish reason field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub finish_reason: Option<String>,

    /// Id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Item id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub item_id: Option<String>,

    /// Legal hold field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Message kind field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_kind: Option<String>,

    /// Message no field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_no: Option<String>,

    /// Metadata field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Raw provider json field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub raw_provider_json: Option<std::collections::HashMap<String, String>>,

    /// Request id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Role field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,

    /// Runtime field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Runtime invocation id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Status field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token count field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_count: Option<String>,

    /// Trace id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Turn id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub turn_id: Option<String>,

    /// Updated at field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Usage link id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_link_id: Option<String>,

    /// User id field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai chat message record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
