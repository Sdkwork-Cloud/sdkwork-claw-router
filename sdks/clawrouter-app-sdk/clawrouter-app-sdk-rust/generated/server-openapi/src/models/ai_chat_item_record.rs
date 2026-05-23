use serde::{Deserialize, Serialize};

/// Ai chat item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChatItemRecord {
    /// Completed at field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Content json field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_json: Option<std::collections::HashMap<String, String>>,

    /// Content text field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_text: Option<String>,

    /// Conversation id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Direction field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direction: Option<String>,

    /// Id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Item type field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub item_type: Option<String>,

    /// Legal hold field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Parent item id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_item_id: Option<String>,

    /// Payload hash field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,

    /// Provider call id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_call_id: Option<String>,

    /// Provider item id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_item_id: Option<String>,

    /// Provider response id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_response_id: Option<String>,

    /// Raw provider json field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub raw_provider_json: Option<std::collections::HashMap<String, String>>,

    /// Request id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Role field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,

    /// Runtime field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Runtime invocation id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Sequence no field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sequence_no: Option<String>,

    /// Status field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Turn id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub turn_id: Option<String>,

    /// User id field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai chat item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
