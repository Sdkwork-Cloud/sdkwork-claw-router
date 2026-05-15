use serde::{Deserialize, Serialize};

/// Ai model catalog source record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelCatalogSourceRecord {
    /// Catalog version field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_version: Option<String>,

    /// Created at field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Error message masked field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Id field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last observed at field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_observed_at: Option<String>,

    /// Last success at field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_success_at: Option<String>,

    /// Metadata field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Normalized payload hash field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub normalized_payload_hash: Option<String>,

    /// Organization id field on ai model catalog source record.
    pub organization_id: String,

    /// Parser kind field on ai model catalog source record.
    pub parser_kind: String,

    /// Provider code field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Raw payload ref field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub raw_payload_ref: Option<String>,

    /// Refresh interval seconds field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refresh_interval_seconds: Option<String>,

    /// Region code field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Schema version field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub schema_version: Option<String>,

    /// Source code field on ai model catalog source record.
    pub source_code: String,

    /// Source hash field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_hash: Option<String>,

    /// Source kind field on ai model catalog source record.
    pub source_kind: String,

    /// Source name field on ai model catalog source record.
    pub source_name: String,

    /// Source url field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_url: Option<String>,

    /// Status field on ai model catalog source record.
    pub status: String,

    /// Tenant id field on ai model catalog source record.
    pub tenant_id: String,

    /// Trust level field on ai model catalog source record.
    pub trust_level: String,

    /// Updated at field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model catalog source record.
    pub uuid: String,

    /// Vendor code field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,

    /// Version field on ai model catalog source record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
