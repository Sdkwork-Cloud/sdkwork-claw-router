use serde::{Deserialize, Serialize};

/// Ai chat context snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChatContextSnapshotRecord {
    /// Context json field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub context_json: Option<std::collections::HashMap<String, String>>,

    /// Conversation id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Excluded item ids field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub excluded_item_ids: Option<std::collections::HashMap<String, String>>,

    /// Excluded memory ids field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub excluded_memory_ids: Option<std::collections::HashMap<String, String>>,

    /// Id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Included item ids field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub included_item_ids: Option<std::collections::HashMap<String, String>>,

    /// Included memory ids field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub included_memory_ids: Option<std::collections::HashMap<String, String>>,

    /// Input token estimate field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_token_estimate: Option<String>,

    /// Legal hold field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Memory pack field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_pack: Option<std::collections::HashMap<String, String>>,

    /// Memory token count field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_token_count: Option<String>,

    /// Metadata field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Previous response id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub previous_response_id: Option<String>,

    /// Provider conversation id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_conversation_id: Option<String>,

    /// Request id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Runtime invocation id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Snapshot no field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_no: Option<i64>,

    /// Status field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Strategy field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub strategy: Option<String>,

    /// Tenant id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Truncation reason field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub truncation_reason: Option<String>,

    /// Turn id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub turn_id: Option<String>,

    /// User id field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai chat context snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
