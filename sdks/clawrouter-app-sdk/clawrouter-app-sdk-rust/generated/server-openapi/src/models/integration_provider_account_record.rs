use serde::{Deserialize, Serialize};

/// Integration provider account record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationProviderAccountRecord {
    /// Account code field on integration provider account record.
    pub account_code: String,

    /// Account name field on integration provider account record.
    pub account_name: String,

    /// Account type field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_type: Option<String>,

    /// Auth config field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_config: Option<std::collections::HashMap<String, String>>,

    /// Auth type field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Base url field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Channel type field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_type: Option<String>,

    /// Consecutive error count field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Created at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential profile field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_profile: Option<String>,

    /// Credential version field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_version: Option<String>,

    /// Data scope field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Environment field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Health status field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last latency ms field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Last rotated at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_rotated_at: Option<String>,

    /// Last used at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,

    /// Last verified at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<String>,

    /// Masked label field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub masked_label: Option<String>,

    /// Metadata field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Next rotate at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub next_rotate_at: Option<String>,

    /// Organization id field on integration provider account record.
    pub organization_id: String,

    /// Provider code field on integration provider account record.
    pub provider_code: String,

    /// Provider id field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Quota snapshot field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Region code field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Risk level field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Secret hash field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_hash: Option<String>,

    /// Secret ref field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on integration provider account record.
    pub status: String,

    /// Tenant id field on integration provider account record.
    pub tenant_id: String,

    /// Updated at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration provider account record.
    pub uuid: String,

    /// Version field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
