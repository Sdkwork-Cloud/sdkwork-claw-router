use serde::{Deserialize, Serialize};

/// Agent create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentCreateRequest {
    /// Code field on agent create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Description field on agent create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "mcpPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mcp_policy: Option<std::collections::HashMap<String, String>>,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "memoryPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_policy: Option<std::collections::HashMap<String, String>>,

    /// Model field on agent create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Name field on agent create request.
    pub name: String,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "runtimePolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_policy: Option<std::collections::HashMap<String, String>>,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "skillPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skill_policy: Option<std::collections::HashMap<String, String>>,

    /// System prompt field on agent create request.
    #[serde(rename = "systemPrompt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub system_prompt: Option<String>,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "toolPolicy")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_policy: Option<std::collections::HashMap<String, String>>,
}
