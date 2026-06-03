use serde::{Deserialize, Serialize};

/// Ai site service record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiSiteServiceRecord {
    /// Auth config field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_config: Option<std::collections::HashMap<String, String>>,

    /// Auth type field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Base url field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Consecutive error count field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Created at field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential hash field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_hash: Option<String>,

    /// Credential profile field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_profile: Option<String>,

    /// Credential ref field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_ref: Option<String>,

    /// Credential version field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_version: Option<String>,

    /// Data scope field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Environment field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Health status field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last latency ms field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Last sync at field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_sync_at: Option<String>,

    /// Last verified at field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<String>,

    /// Masked label field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub masked_label: Option<String>,

    /// Metadata field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai site service record.
    pub organization_id: String,

    /// Protocol code field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub protocol_code: Option<String>,

    /// Region code field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Service code field on ai site service record.
    pub service_code: String,

    /// Service name field on ai site service record.
    pub service_name: String,

    /// Service type field on ai site service record.
    pub service_type: String,

    /// Site code field on ai site service record.
    pub site_code: String,

    /// Site id field on ai site service record.
    pub site_id: String,

    /// Sort order field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai site service record.
    pub status: String,

    /// Tenant id field on ai site service record.
    pub tenant_id: String,

    /// Updated at field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai site service record.
    pub uuid: String,

    /// Version field on ai site service record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
