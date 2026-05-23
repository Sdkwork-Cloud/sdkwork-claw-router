use serde::{Deserialize, Serialize};

/// Agent run item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunItem {
    /// Agent id field on agent run item.
    #[serde(rename = "agentId")]
    pub agent_id: String,

    /// Agent version id field on agent run item.
    #[serde(rename = "agentVersionId")]
    pub agent_version_id: String,

    /// Cached tokens field on agent run item.
    #[serde(rename = "cachedTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_tokens: Option<i64>,

    /// Completed at field on agent run item.
    #[serde(rename = "completedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on agent run item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Error message masked field on agent run item.
    #[serde(rename = "errorMessageMasked")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Execution mode field on agent run item.
    #[serde(rename = "executionMode")]
    pub execution_mode: String,

    /// Id field on agent run item.
    pub id: String,

    /// Input message field on agent run item.
    #[serde(rename = "inputMessage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_message: Option<String>,

    /// Input tokens field on agent run item.
    #[serde(rename = "inputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_tokens: Option<i64>,

    /// Memory space id field on agent run item.
    #[serde(rename = "memorySpaceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Model field on agent run item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Output message field on agent run item.
    #[serde(rename = "outputMessage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_message: Option<String>,

    /// Output tokens field on agent run item.
    #[serde(rename = "outputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_tokens: Option<i64>,

    /// Request id field on agent run item.
    #[serde(rename = "requestId")]
    pub request_id: String,

    /// Runtime field on agent run item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Session id field on agent run item.
    #[serde(rename = "sessionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,

    /// Source surface field on agent run item.
    #[serde(rename = "sourceSurface")]
    pub source_surface: String,

    /// Started at field on agent run item.
    #[serde(rename = "startedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on agent run item.
    pub status: String,

    /// Total steps field on agent run item.
    #[serde(rename = "totalSteps")]
    pub total_steps: i64,

    /// Total tokens field on agent run item.
    #[serde(rename = "totalTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<i64>,

    /// Trace id field on agent run item.
    #[serde(rename = "traceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,
}
