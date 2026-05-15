use serde::{Deserialize, Serialize};

/// Ai generation job record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiGenerationJobRecord {
    /// Channel id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Completed at field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Failure code field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message masked field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message_masked: Option<String>,

    /// Id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Input asset ids field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub input_asset_ids: Option<std::collections::HashMap<String, String>>,

    /// Job type field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub job_type: Option<String>,

    /// Legal hold field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Negative prompt field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub negative_prompt: Option<String>,

    /// Organization id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Parameter snapshot field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parameter_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Payload hash field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Progress percent field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub progress_percent: Option<i64>,

    /// Prompt field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt: Option<String>,

    /// Provider id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Request id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Session id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,

    /// Started at field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,

    /// Status field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Usage fact id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_fact_id: Option<String>,

    /// User id field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai generation job record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
