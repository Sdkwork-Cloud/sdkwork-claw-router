use serde::{Deserialize, Serialize};

/// Ai chat conversation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChatConversationRecord {
    /// Agent id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Agent session id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Cached token total field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_token_total: Option<String>,

    /// Conversation code field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_code: Option<String>,

    /// Cost amount total field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_amount_total: Option<String>,

    /// Created at field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data scope field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default endpoint field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_endpoint: Option<String>,

    /// Default model field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_model: Option<String>,

    /// Default provider field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_provider: Option<String>,

    /// Deleted at field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input token total field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_token_total: Option<String>,

    /// Item count field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub item_count: Option<String>,

    /// Last item id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_item_id: Option<String>,

    /// Last message preview field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_message_preview: Option<String>,

    /// Last turn id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_turn_id: Option<String>,

    /// Memory space id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Message count field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_count: Option<String>,

    /// Metadata field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output token total field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_token_total: Option<String>,

    /// Owner id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Reasoning token total field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reasoning_token_total: Option<String>,

    /// Source surface field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_surface: Option<String>,

    /// Status field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Summary field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tenant id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Turn count field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub turn_count: Option<String>,

    /// Updated at field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Visibility field on ai chat conversation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
}
