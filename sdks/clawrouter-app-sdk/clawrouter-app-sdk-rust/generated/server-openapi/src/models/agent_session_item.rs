use serde::{Deserialize, Serialize};

/// Agent session item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentSessionItem {
    /// Agent id field on agent session item.
    #[serde(rename = "agentId")]
    pub agent_id: String,

    /// Agent version id field on agent session item.
    #[serde(rename = "agentVersionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_version_id: Option<String>,

    /// Approval policy field on agent session item.
    #[serde(rename = "approvalPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_policy: Option<String>,

    /// Chat conversation id field on agent session item.
    #[serde(rename = "chatConversationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_conversation_id: Option<String>,

    /// Created at field on agent session item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Cwd field on agent session item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cwd: Option<String>,

    /// Default model field on agent session item.
    #[serde(rename = "defaultModel")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_model: Option<String>,

    /// Id field on agent session item.
    pub id: String,

    /// Last active at field on agent session item.
    #[serde(rename = "lastActiveAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_active_at: Option<String>,

    /// Last run id field on agent session item.
    #[serde(rename = "lastRunId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_run_id: Option<String>,

    /// Last step id field on agent session item.
    #[serde(rename = "lastStepId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_step_id: Option<i64>,

    /// Memory space id field on agent session item.
    #[serde(rename = "memorySpaceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Permission mode field on agent session item.
    #[serde(rename = "permissionMode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_mode: Option<String>,

    /// Run count field on agent session item.
    #[serde(rename = "runCount")]
    pub run_count: i64,

    /// Runtime field on agent session item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Sandbox policy field on agent session item.
    #[serde(rename = "sandboxPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sandbox_policy: Option<String>,

    /// Session kind field on agent session item.
    #[serde(rename = "sessionKind")]
    pub session_kind: String,

    /// Source surface field on agent session item.
    #[serde(rename = "sourceSurface")]
    pub source_surface: String,

    /// Status field on agent session item.
    pub status: String,

    /// Step count field on agent session item.
    #[serde(rename = "stepCount")]
    pub step_count: i64,

    /// Title field on agent session item.
    pub title: String,

    /// Tool call count field on agent session item.
    #[serde(rename = "toolCallCount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_call_count: Option<i64>,

    /// Updated at field on agent session item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
