use serde::{Deserialize, Serialize};

/// Ai agent run record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiAgentRunRecord {
    /// Agent id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,

    /// Agent session id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_session_id: Option<String>,

    /// Agent version id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub agent_version_id: Option<String>,

    /// Audio seconds field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub audio_seconds: Option<String>,

    /// Cached tokens field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cached_tokens: Option<String>,

    /// Cancelled at field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cancelled_at: Option<String>,

    /// Completed at field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Completion tokens field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completion_tokens: Option<String>,

    /// Created at field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Error message masked field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Execution mode field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub execution_mode: Option<String>,

    /// Failed at field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failed_at: Option<String>,

    /// Id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Image count field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image_count: Option<String>,

    /// Input message field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_message: Option<String>,

    /// Legal hold field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Memory space id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub memory_space_id: Option<String>,

    /// Metadata field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metering status field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metering_status: Option<String>,

    /// Model field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Output message field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_message: Option<String>,

    /// Payload hash field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Planner model field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub planner_model: Option<String>,

    /// Prompt tokens field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_tokens: Option<String>,

    /// Request id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Run status field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_status: Option<String>,

    /// Run uuid field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_uuid: Option<String>,

    /// Runtime field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub runtime: Option<String>,

    /// Source surface field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_surface: Option<String>,

    /// Started at field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target modality field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_modality: Option<String>,

    /// Tenant id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total steps field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_steps: Option<i64>,

    /// Total tokens field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<String>,

    /// Trace id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage fact id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// Usage json field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_json: Option<std::collections::HashMap<String, String>>,

    /// User id field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Video seconds field on ai agent run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub video_seconds: Option<String>,
}
