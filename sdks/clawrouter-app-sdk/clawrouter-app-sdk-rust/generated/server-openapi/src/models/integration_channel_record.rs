use serde::{Deserialize, Serialize};

/// Integration channel record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationChannelRecord {
    /// Access type field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_type: Option<String>,

    /// Account id field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_id: Option<String>,

    /// Base url field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Capabilities field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<std::collections::HashMap<String, String>>,

    /// Channel code field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_code: Option<String>,

    /// Circuit breaker policy field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub circuit_breaker_policy: Option<std::collections::HashMap<String, String>>,

    /// Consecutive error count field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Created at field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Environment field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Health status field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last latency ms field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Metadata field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model mode field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_mode: Option<String>,

    /// Name field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Priority field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Protocol field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol: Option<String>,

    /// Provider code field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider id field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Proxy id field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub proxy_id: Option<String>,

    /// Region field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,

    /// Retry policy field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<std::collections::HashMap<String, String>>,

    /// Rpm limit field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rpm_limit: Option<String>,

    /// Status field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Timeout ms field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timeout_ms: Option<i64>,

    /// Updated at field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Weight field on integration channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
