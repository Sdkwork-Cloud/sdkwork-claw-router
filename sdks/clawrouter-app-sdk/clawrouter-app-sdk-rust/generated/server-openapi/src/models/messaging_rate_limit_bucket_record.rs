use serde::{Deserialize, Serialize};

/// Messaging rate limit bucket record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingRateLimitBucketRecord {
    /// Channel field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Created at field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Device hash field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_hash: Option<String>,

    /// Id field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Ip hash field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_hash: Option<String>,

    /// Last event at field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_event_at: Option<String>,

    /// Metadata field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Reject count field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reject_count: Option<i64>,

    /// Scene code field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene_code: Option<String>,

    /// Send count field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub send_count: Option<i64>,

    /// Status field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target hash field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_hash: Option<String>,

    /// Tenant id field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Verify count field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub verify_count: Option<i64>,

    /// Version field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Window seconds field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub window_seconds: Option<i64>,

    /// Window start field on messaging rate limit bucket record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub window_start: Option<String>,
}
