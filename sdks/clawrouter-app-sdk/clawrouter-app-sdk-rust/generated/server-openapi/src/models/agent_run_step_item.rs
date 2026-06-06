use serde::{Deserialize, Serialize};

/// Agent run step item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunStepItem {
    /// Cached tokens field on agent run step item.
    #[serde(rename = "cachedTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_tokens: Option<String>,

    /// Completed at field on agent run step item.
    #[serde(rename = "completedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on agent run step item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on agent run step item.
    pub id: String,

    /// Input tokens field on agent run step item.
    #[serde(rename = "inputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_tokens: Option<String>,

    /// Latency ms field on agent run step item.
    #[serde(rename = "latencyMs")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<String>,

    /// Model field on agent run step item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Output tokens field on agent run step item.
    #[serde(rename = "outputTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_tokens: Option<String>,

    /// Run id field on agent run step item.
    #[serde(rename = "runId")]
    pub run_id: String,

    /// Runtime invocation id field on agent run step item.
    #[serde(rename = "runtimeInvocationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime_invocation_id: Option<String>,

    /// Started at field on agent run step item.
    #[serde(rename = "startedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on agent run step item.
    pub status: String,

    /// Step index field on agent run step item.
    #[serde(rename = "stepIndex")]
    pub step_index: String,

    /// Step type field on agent run step item.
    #[serde(rename = "stepType")]
    pub step_type: String,

    /// Title field on agent run step item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Tool name field on agent run step item.
    #[serde(rename = "toolName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_name: Option<String>,

    /// Total tokens field on agent run step item.
    #[serde(rename = "totalTokens")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<String>,
}
