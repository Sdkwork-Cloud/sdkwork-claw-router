use serde::{Deserialize, Serialize};

/// Ai quota policy record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiQuotaPolicyRecord {
    /// Block duration seconds field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub block_duration_seconds: Option<String>,

    /// Burst limit field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub burst_limit: Option<String>,

    /// Channel group id field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_id: Option<String>,

    /// Created at field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Exhausted at field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub exhausted_at: Option<String>,

    /// Id field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Name field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Policy code field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_code: Option<String>,

    /// Quota limit field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_limit: Option<String>,

    /// Quota period field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_period: Option<String>,

    /// Quota unit field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_unit: Option<String>,

    /// Requests per day field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requests_per_day: Option<String>,

    /// Requests per minute field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requests_per_minute: Option<String>,

    /// Requests per second field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requests_per_second: Option<String>,

    /// Reset mode field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reset_mode: Option<String>,

    /// Scope id field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_id: Option<String>,

    /// Scope type field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_type: Option<String>,

    /// Status field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Subject id field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_id: Option<String>,

    /// Subject ref hash field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_ref_hash: Option<String>,

    /// Subject ref masked field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_ref_masked: Option<String>,

    /// Subject type field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_type: Option<String>,

    /// Tenant id field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tokens per minute field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tokens_per_minute: Option<String>,

    /// Updated at field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai quota policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
