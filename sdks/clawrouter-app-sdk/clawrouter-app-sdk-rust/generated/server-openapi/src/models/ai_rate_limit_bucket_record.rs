use serde::{Deserialize, Serialize};

/// Ai rate limit bucket record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRateLimitBucketRecord {
    /// Bucket key field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub bucket_key: Option<String>,

    /// Created at field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Current count field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub current_count: Option<String>,

    /// Current tokens field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub current_tokens: Option<String>,

    /// Id field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last request at field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_request_at: Option<String>,

    /// Metadata field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Quota policy id field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_policy_id: Option<String>,

    /// Rebuild version field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Remaining count field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remaining_count: Option<String>,

    /// Remaining tokens field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remaining_tokens: Option<String>,

    /// Source id field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Subject id field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_id: Option<String>,

    /// Subject type field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subject_type: Option<String>,

    /// Tenant id field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Window end field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub window_end: Option<String>,

    /// Window start field on ai rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub window_start: Option<String>,
}
