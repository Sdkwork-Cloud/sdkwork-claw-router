use serde::{Deserialize, Serialize};

/// Ai channel group metric snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelGroupMetricSnapshotRecord {
    /// Capacity limit field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capacity_limit: Option<String>,

    /// Capacity used field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capacity_used: Option<String>,

    /// Channel available count field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_available_count: Option<String>,

    /// Channel group id field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_id: Option<String>,

    /// Channel total count field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_total_count: Option<String>,

    /// Created at field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Group code field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_code: Option<String>,

    /// Health status field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai channel group metric snapshot record.
    pub organization_id: String,

    /// Provider code field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rebuild version field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Request count today field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count_today: Option<String>,

    /// Request count total field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count_total: Option<String>,

    /// Snapshot at field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_at: Option<String>,

    /// Source id field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on ai channel group metric snapshot record.
    pub status: String,

    /// Tenant id field on ai channel group metric snapshot record.
    pub tenant_id: String,

    /// Updated at field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Usage amount today field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_amount_today: Option<String>,

    /// Usage amount total field on ai channel group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_amount_total: Option<String>,

    /// Uuid field on ai channel group metric snapshot record.
    pub uuid: String,
}
