use serde::{Deserialize, Serialize};

/// Ai channel endpoint record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelEndpointRecord {
    /// Api code field on ai channel endpoint record.
    pub api_code: String,

    /// Api endpoint id field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_endpoint_id: Option<String>,

    /// Base url field on ai channel endpoint record.
    pub base_url: String,

    /// Channel code field on ai channel endpoint record.
    pub channel_code: String,

    /// Channel id field on ai channel endpoint record.
    pub channel_id: String,

    /// Channel type field on ai channel endpoint record.
    pub channel_type: String,

    /// Consecutive error count field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Created at field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Health status field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last latency ms field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Metadata field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai channel endpoint record.
    pub organization_id: String,

    /// Path prefix field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path_prefix: Option<String>,

    /// Priority field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Provider code field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Region code field on ai channel endpoint record.
    pub region_code: String,

    /// Retry policy field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<std::collections::HashMap<String, String>>,

    /// Status field on ai channel endpoint record.
    pub status: String,

    /// Tenant id field on ai channel endpoint record.
    pub tenant_id: String,

    /// Timeout ms field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Updated at field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai channel endpoint record.
    pub uuid: String,

    /// Vendor code field on ai channel endpoint record.
    pub vendor_code: String,

    /// Vendor id field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_id: Option<String>,

    /// Version field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Weight field on ai channel endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
