use serde::{Deserialize, Serialize};

/// Ai agent session record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentSessionRecord {
    /// Agent id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Agent version id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_version_id: Option<String>,

    /// Approval policy field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub approval_policy: Option<String>,

    /// Chat conversation id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub chat_conversation_id: Option<String>,

    /// Created at field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Cwd field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cwd: Option<String>,

    /// Data scope field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default model field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_model: Option<String>,

    /// Deleted at field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Execution mode field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub execution_mode: Option<String>,

    /// Forked from run id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub forked_from_run_id: Option<String>,

    /// Forked from step id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub forked_from_step_id: Option<String>,

    /// Git branch field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_branch: Option<String>,

    /// Git commit field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub git_commit: Option<String>,

    /// Id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last active at field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_active_at: Option<String>,

    /// Last run id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_run_id: Option<String>,

    /// Last step id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_step_id: Option<String>,

    /// Memory space id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Metadata field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Parent session id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_session_id: Option<String>,

    /// Permission mode field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_mode: Option<String>,

    /// Provider conversation id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_conversation_id: Option<String>,

    /// Provider session id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_session_id: Option<String>,

    /// Repository id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repository_id: Option<String>,

    /// Resume strategy field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resume_strategy: Option<String>,

    /// Run count field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_count: Option<String>,

    /// Runtime field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Runtime state storage key field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_state_storage_key: Option<String>,

    /// Sandbox policy field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sandbox_policy: Option<String>,

    /// Session code field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_code: Option<String>,

    /// Session kind field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_kind: Option<String>,

    /// Source surface field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_surface: Option<String>,

    /// Status field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Step count field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub step_count: Option<String>,

    /// Summary field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tenant id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Tool call count field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_call_count: Option<String>,

    /// Updated at field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Visibility field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,

    /// Workspace id field on ai agent session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub workspace_id: Option<String>,
}
