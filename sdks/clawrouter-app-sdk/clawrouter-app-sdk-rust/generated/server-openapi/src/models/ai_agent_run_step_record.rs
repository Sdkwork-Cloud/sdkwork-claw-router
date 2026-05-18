use serde::{Deserialize, Serialize};

/// Ai agent run step record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentRunStepRecord {
    /// Agent id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Agent version id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_version_id: Option<String>,

    /// Audio seconds field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audio_seconds: Option<String>,

    /// Cached tokens field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_tokens: Option<String>,

    /// Completed at field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Completion tokens field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completion_tokens: Option<String>,

    /// Created at field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Error message masked field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Image count field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image_count: Option<String>,

    /// Input snapshot field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Latency ms field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<i64>,

    /// Legal hold field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Mcp server id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mcp_server_id: Option<String>,

    /// Metadata field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output snapshot field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Payload hash field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Prompt tokens field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_tokens: Option<String>,

    /// Request id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Run id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_id: Option<String>,

    /// Skill id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skill_id: Option<String>,

    /// Started at field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Step index field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub step_index: Option<i64>,

    /// Step status field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub step_status: Option<String>,

    /// Step type field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub step_type: Option<String>,

    /// Tenant id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Tool binding id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tool_binding_id: Option<String>,

    /// Total tokens field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<String>,

    /// Trace id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage fact id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// User id field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Video seconds field on ai agent run step record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video_seconds: Option<String>,
}
