use serde::{Deserialize, Serialize};

/// Ai model rank snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiModelRankSnapshotRecord {
    /// Base volume field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_volume: Option<String>,

    /// Catalog key field on ai model rank snapshot record.
    pub catalog_key: String,

    /// Color token field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color_token: Option<String>,

    /// Context size text field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub context_size_text: Option<String>,

    /// Cost amount field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_amount: Option<String>,

    /// Cost indicator field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cost_indicator: Option<i64>,

    /// Created at field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Id field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Is new field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_new: Option<bool>,

    /// Latency p 50 ms field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_p50_ms: Option<i64>,

    /// Latency p 95 ms field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_p95_ms: Option<i64>,

    /// License type field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub license_type: Option<String>,

    /// Metadata field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Modality field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub modality: Option<String>,

    /// Model field on ai model rank snapshot record.
    pub model: String,

    /// Model id field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_id: Option<String>,

    /// Organization id field on ai model rank snapshot record.
    pub organization_id: String,

    /// Previous rank no field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub previous_rank_no: Option<i64>,

    /// Pricing text field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_text: Option<String>,

    /// Provider code field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rank no field on ai model rank snapshot record.
    pub rank_no: i64,

    /// Rank payload field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rank_payload: Option<std::collections::HashMap<String, String>>,

    /// Rank scope field on ai model rank snapshot record.
    pub rank_scope: String,

    /// Rebuild version field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Region code field on ai model rank snapshot record.
    pub region_code: String,

    /// Request count field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count: Option<String>,

    /// Snapshot date field on ai model rank snapshot record.
    pub snapshot_date: String,

    /// Snapshot period field on ai model rank snapshot record.
    pub snapshot_period: String,

    /// Source id field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on ai model rank snapshot record.
    pub status: String,

    /// Strengths field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub strengths: Option<std::collections::HashMap<String, String>>,

    /// Success rate field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub success_rate: Option<String>,

    /// Tenant id field on ai model rank snapshot record.
    pub tenant_id: String,

    /// Token count field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_count: Option<String>,

    /// Trend score field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trend_score: Option<String>,

    /// Updated at field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai model rank snapshot record.
    pub uuid: String,

    /// Vendor code field on ai model rank snapshot record.
    pub vendor_code: String,

    /// Vendor name snapshot field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub vendor_name_snapshot: Option<String>,

    /// Win rate field on ai model rank snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub win_rate: Option<String>,
}
