use serde::{Deserialize, Serialize};

/// Ai pricing import snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiPricingImportSnapshotRecord {
    /// Accepted count field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub accepted_count: Option<String>,

    /// Created at field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data format field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_format: Option<String>,

    /// Error message masked field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Id field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Import source field on ai pricing import snapshot record.
    pub import_source: String,

    /// Legal hold field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Normalized payload hash field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub normalized_payload_hash: Option<String>,

    /// Observed at field on ai pricing import snapshot record.
    pub observed_at: String,

    /// Organization id field on ai pricing import snapshot record.
    pub organization_id: String,

    /// Payload hash field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Published at field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Raw payload ref field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub raw_payload_ref: Option<String>,

    /// Rejected count field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rejected_count: Option<String>,

    /// Request id field on ai pricing import snapshot record.
    pub request_id: String,

    /// Retention until field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Row count field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub row_count: Option<String>,

    /// Schema version field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub schema_version: Option<String>,

    /// Source hash field on ai pricing import snapshot record.
    pub source_hash: String,

    /// Source name field on ai pricing import snapshot record.
    pub source_name: String,

    /// Source url field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_url: Option<String>,

    /// Source version field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on ai pricing import snapshot record.
    pub status: String,

    /// Tenant id field on ai pricing import snapshot record.
    pub tenant_id: String,

    /// Trace id field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// Upstream commit field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_commit: Option<String>,

    /// User id field on ai pricing import snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai pricing import snapshot record.
    pub uuid: String,
}
