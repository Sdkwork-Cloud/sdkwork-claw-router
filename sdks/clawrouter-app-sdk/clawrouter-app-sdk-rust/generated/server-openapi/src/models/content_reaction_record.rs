use serde::{Deserialize, Serialize};

/// Content reaction record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ContentReactionRecord {
    /// Cancelled at field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cancelled_at: Option<String>,

    /// Client ip hash field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_hash: Option<String>,

    /// Created at field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Reaction type field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reaction_type: Option<String>,

    /// Reaction value field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reaction_value: Option<String>,

    /// Request id field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Status field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target id field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_id: Option<String>,

    /// Target type field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Tenant id field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User agent hash field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent_hash: Option<String>,

    /// User id field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on content reaction record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
