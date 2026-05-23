use serde::{Deserialize, Serialize};

/// Agent run create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunCreateRequest {
    /// Agent id field on agent run create request.
    #[serde(rename = "agentId")]
    pub agent_id: String,

    /// Agent version id field on agent run create request.
    #[serde(rename = "agentVersionId")]
    pub agent_version_id: String,

    /// Execution mode field on agent run create request.
    #[serde(rename = "executionMode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub execution_mode: Option<String>,

    /// Input message field on agent run create request.
    #[serde(rename = "inputMessage")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_message: Option<String>,

    /// Memory space id field on agent run create request.
    #[serde(rename = "memorySpaceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Metadata field on agent run create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on agent run create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Request id field on agent run create request.
    #[serde(rename = "requestId")]
    pub request_id: String,

    /// Runtime field on agent run create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Source surface field on agent run create request.
    #[serde(rename = "sourceSurface")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_surface: Option<String>,

    /// Trace id field on agent run create request.
    #[serde(rename = "traceId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,
}
