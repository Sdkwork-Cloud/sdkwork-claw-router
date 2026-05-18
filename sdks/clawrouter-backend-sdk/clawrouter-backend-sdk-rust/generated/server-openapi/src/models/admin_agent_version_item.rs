use serde::{Deserialize, Serialize};

/// Admin agent version item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAgentVersionItem {
    /// Created at field on admin agent version item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on admin agent version item.
    pub id: String,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "mcpPolicy")]
    pub mcp_policy: std::collections::HashMap<String, String>,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "memoryPolicy")]
    pub memory_policy: std::collections::HashMap<String, String>,

    /// Model field on admin agent version item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Release status field on admin agent version item.
    #[serde(rename = "releaseStatus")]
    pub release_status: String,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "runtimePolicy")]
    pub runtime_policy: std::collections::HashMap<String, String>,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "skillPolicy")]
    pub skill_policy: std::collections::HashMap<String, String>,

    /// System prompt field on admin agent version item.
    #[serde(rename = "systemPrompt")]
    pub system_prompt: String,

    /// Open JSON policy document validated by the agent runtime for model, tool, memory, MCP, skill, or execution settings.
    #[serde(rename = "toolPolicy")]
    pub tool_policy: std::collections::HashMap<String, String>,

    /// Updated at field on admin agent version item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Version no field on admin agent version item.
    #[serde(rename = "versionNo")]
    pub version_no: i64,
}
