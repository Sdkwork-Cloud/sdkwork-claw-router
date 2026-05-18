use serde::{Deserialize, Serialize};

/// Admin agent capabilities schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAgentCapabilities {
    /// Mcp server count field on admin agent capabilities.
    #[serde(rename = "mcpServerCount")]
    pub mcp_server_count: i64,

    /// Memory enabled field on admin agent capabilities.
    #[serde(rename = "memoryEnabled")]
    pub memory_enabled: bool,

    /// Skill binding count field on admin agent capabilities.
    #[serde(rename = "skillBindingCount")]
    pub skill_binding_count: i64,
}
