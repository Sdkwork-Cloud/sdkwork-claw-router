use serde::{Deserialize, Serialize};

/// Ai model catalog sync run record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelCatalogSyncRunRecord {
    /// Accepted count field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub accepted_count: Option<String>,

    /// Catalog version field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_version: Option<String>,

    /// Change summary field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub change_summary: Option<std::collections::HashMap<String, String>>,

    /// Created at field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Error message masked field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Finished at field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub finished_at: Option<String>,

    /// Id field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Observed at field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub observed_at: Option<String>,

    /// Observed meter count field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub observed_meter_count: Option<String>,

    /// Observed model count field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub observed_model_count: Option<String>,

    /// Observed price count field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub observed_price_count: Option<String>,

    /// Observed vendor count field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub observed_vendor_count: Option<String>,

    /// Organization id field on ai model catalog sync run record.
    pub organization_id: String,

    /// Payload hash field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider code field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Region code field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Rejected count field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rejected_count: Option<String>,

    /// Request id field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Run status field on ai model catalog sync run record.
    pub run_status: String,

    /// Skipped count field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub skipped_count: Option<String>,

    /// Source code field on ai model catalog sync run record.
    pub source_code: String,

    /// Source hash field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_hash: Option<String>,

    /// Source id field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Started at field on ai model catalog sync run record.
    pub started_at: String,

    /// Status field on ai model catalog sync run record.
    pub status: String,

    /// Tenant id field on ai model catalog sync run record.
    pub tenant_id: String,

    /// Trace id field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai model catalog sync run record.
    pub uuid: String,

    /// Vendor code field on ai model catalog sync run record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_code: Option<String>,
}
