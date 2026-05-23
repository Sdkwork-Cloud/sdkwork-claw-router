use serde::{Deserialize, Serialize};

use crate::models::{UsageSnapshot};

/// Agent run step create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunStepCreateRequest {
    /// Input json field on agent run step create request.
    #[serde(rename = "inputJson")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_json: Option<std::collections::HashMap<String, String>>,

    /// Metadata field on agent run step create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on agent run step create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Output json field on agent run step create request.
    #[serde(rename = "outputJson")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_json: Option<std::collections::HashMap<String, String>>,

    /// Runtime invocation id field on agent run step create request.
    #[serde(rename = "runtimeInvocationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Status field on agent run step create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Step type field on agent run step create request.
    #[serde(rename = "stepType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub step_type: Option<String>,

    /// Title field on agent run step create request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Tool name field on agent run step create request.
    #[serde(rename = "toolName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_name: Option<String>,

    /// Usage json field on agent run step create request.
    #[serde(rename = "usageJson")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_json: Option<UsageSnapshot>,
}
