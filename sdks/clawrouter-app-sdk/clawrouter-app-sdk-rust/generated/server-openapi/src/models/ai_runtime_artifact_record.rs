use serde::{Deserialize, Serialize};

/// Ai runtime artifact record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRuntimeArtifactRecord {
    /// Agent run id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_id: Option<String>,

    /// Agent run step id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_run_step_id: Option<String>,

    /// Agent session id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Artifact type field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_type: Option<String>,

    /// Chat item id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_item_id: Option<String>,

    /// Chat turn id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_turn_id: Option<String>,

    /// Content json field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_json: Option<std::collections::HashMap<String, String>>,

    /// Content text field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_text: Option<String>,

    /// Conversation id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub conversation_id: Option<String>,

    /// Created at field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Media resource id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub media_resource_id: Option<String>,

    /// Message id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,

    /// Metadata field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mime type field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Name field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Object blob id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_blob_id: Option<String>,

    /// Organization id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Resource snapshot field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Retention until field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Runtime invocation id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Sha 256 field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sha256: Option<String>,

    /// Size bytes field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub size_bytes: Option<String>,

    /// Status field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai runtime artifact record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
