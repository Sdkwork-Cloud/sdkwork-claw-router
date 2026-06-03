use serde::{Deserialize, Serialize};

/// Ai channel record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChannelRecord {
    /// Auth config field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_config: Option<std::collections::HashMap<String, String>>,

    /// Auth type field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Base url field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Channel code field on ai channel record.
    pub channel_code: String,

    /// Channel name field on ai channel record.
    pub channel_name: String,

    /// Channel type field on ai channel record.
    pub channel_type: String,

    /// Circuit breaker policy field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub circuit_breaker_policy: Option<std::collections::HashMap<String, String>>,

    /// Consecutive error count field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Created at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential hash field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_hash: Option<String>,

    /// Credential profile field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_profile: Option<String>,

    /// Credential ref field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_ref: Option<String>,

    /// Credential rotation policy field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_rotation_policy: Option<std::collections::HashMap<String, String>>,

    /// Credential version field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_version: Option<String>,

    /// Data scope field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Environment field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// External channel id field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_channel_id: Option<String>,

    /// Health status field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last balance checked at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_balance_checked_at: Option<String>,

    /// Last latency ms field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Last rotated at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_rotated_at: Option<String>,

    /// Last used at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,

    /// Last verified at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<String>,

    /// Masked label field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub masked_label: Option<String>,

    /// Metadata field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Next rotate at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub next_rotate_at: Option<String>,

    /// Organization id field on ai channel record.
    pub organization_id: String,

    /// Priority field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Protocol code field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol_code: Option<String>,

    /// Provider code field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider id field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Proxy id field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub proxy_id: Option<String>,

    /// Quota limit field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_limit: Option<String>,

    /// Quota unit field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_unit: Option<String>,

    /// Quota used field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_used: Option<String>,

    /// Region code field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Retry policy field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<std::collections::HashMap<String, String>>,

    /// Risk level field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Rpm limit field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rpm_limit: Option<String>,

    /// Site channel role field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_channel_role: Option<String>,

    /// Site code field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_code: Option<String>,

    /// Site id field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_id: Option<String>,

    /// Site service code field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_service_code: Option<String>,

    /// Site service id field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_service_id: Option<String>,

    /// Status field on ai channel record.
    pub status: String,

    /// Tenant id field on ai channel record.
    pub tenant_id: String,

    /// Timeout ms field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Updated at field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Upstream balance amount field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_balance_amount: Option<String>,

    /// Upstream balance currency field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_balance_currency: Option<String>,

    /// Uuid field on ai channel record.
    pub uuid: String,

    /// Version field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Weight field on ai channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
