use serde::{Deserialize, Serialize};

/// Ai memory event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiMemoryEventRecord {
    /// Actor id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actor_id: Option<String>,

    /// Actor type field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actor_type: Option<String>,

    /// After json field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub after_json: Option<std::collections::HashMap<String, String>>,

    /// Before json field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub before_json: Option<std::collections::HashMap<String, String>>,

    /// Conversation id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Decision reason field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub decision_reason: Option<String>,

    /// Event type field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_type: Option<String>,

    /// Id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Invocation id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invocation_id: Option<String>,

    /// Legal hold field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Memory id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_id: Option<String>,

    /// Metadata field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Space id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub space_id: Option<String>,

    /// Status field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Turn id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub turn_id: Option<String>,

    /// User id field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai memory event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
