use serde::{Deserialize, Serialize};

/// Agent session create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentSessionCreateRequest {
    /// Agent version id field on agent session create request.
    #[serde(rename = "agentVersionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_version_id: Option<String>,

    /// Approval policy field on agent session create request.
    #[serde(rename = "approvalPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_policy: Option<String>,

    /// Chat conversation id field on agent session create request.
    #[serde(rename = "chatConversationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_conversation_id: Option<String>,

    /// Cwd field on agent session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cwd: Option<String>,

    /// Default model field on agent session create request.
    #[serde(rename = "defaultModel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_model: Option<String>,

    /// Memory space id field on agent session create request.
    #[serde(rename = "memorySpaceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Metadata field on agent session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Permission mode field on agent session create request.
    #[serde(rename = "permissionMode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_mode: Option<String>,

    /// Runtime field on agent session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Sandbox policy field on agent session create request.
    #[serde(rename = "sandboxPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sandbox_policy: Option<String>,

    /// Session kind field on agent session create request.
    #[serde(rename = "sessionKind")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_kind: Option<String>,

    /// Source surface field on agent session create request.
    #[serde(rename = "sourceSurface")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_surface: Option<String>,

    /// Title field on agent session create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}
