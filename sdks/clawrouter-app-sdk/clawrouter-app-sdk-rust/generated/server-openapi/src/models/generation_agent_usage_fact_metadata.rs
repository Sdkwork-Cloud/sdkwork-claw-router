use serde::{Deserialize, Serialize};

/// Generation agent usage fact metadata schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentUsageFactMetadata {
    /// Agent id field on generation agent usage fact metadata.
    #[serde(rename = "agentId")]
    pub agent_id: String,

    /// Agent version id field on generation agent usage fact metadata.
    #[serde(rename = "agentVersionId")]
    pub agent_version_id: String,

    /// Mcp server id field on generation agent usage fact metadata.
    #[serde(rename = "mcpServerId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mcp_server_id: Option<String>,

    /// Metering source field on generation agent usage fact metadata.
    #[serde(rename = "meteringSource")]
    pub metering_source: String,

    /// Run id field on generation agent usage fact metadata.
    #[serde(rename = "runId")]
    pub run_id: String,

    /// Skill id field on generation agent usage fact metadata.
    #[serde(rename = "skillId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skill_id: Option<String>,

    /// Step id field on generation agent usage fact metadata.
    #[serde(rename = "stepId")]
    pub step_id: String,

    /// Tool id field on generation agent usage fact metadata.
    #[serde(rename = "toolId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_id: Option<String>,
}
