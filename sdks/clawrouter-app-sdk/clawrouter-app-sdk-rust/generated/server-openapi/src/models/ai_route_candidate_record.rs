use serde::{Deserialize, Serialize};

/// Ai route candidate record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRouteCandidateRecord {
    /// Api code field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub api_code: Option<String>,

    /// Catalog key field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_key: Option<String>,

    /// Channel group id field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_id: Option<String>,

    /// Channel id field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Channel type field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_type: Option<String>,

    /// Config version field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_version: Option<String>,

    /// Created at field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Endpoint id field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_id: Option<String>,

    /// Health status field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model code field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_code: Option<String>,

    /// Organization id field on ai route candidate record.
    pub organization_id: String,

    /// Priority field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Provider code field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rebuild version field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Refreshed at field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refreshed_at: Option<String>,

    /// Region code field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Source id field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on ai route candidate record.
    pub status: String,

    /// Tenant id field on ai route candidate record.
    pub tenant_id: String,

    /// Updated at field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai route candidate record.
    pub uuid: String,

    /// Vendor code field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Weight field on ai route candidate record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
