use serde::{Deserialize, Serialize};

/// Model ranking refresh trigger response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ModelRankingRefreshTriggerResponse {
    /// Cache max age seconds field on model ranking refresh trigger response.
    #[serde(rename = "cacheMaxAgeSeconds")]
    pub cache_max_age_seconds: i64,

    /// Generated count field on model ranking refresh trigger response.
    #[serde(rename = "generatedCount")]
    pub generated_count: i64,

    /// Next refresh at field on model ranking refresh trigger response.
    #[serde(rename = "nextRefreshAt")]
    pub next_refresh_at: String,

    /// Organization id field on model ranking refresh trigger response.
    #[serde(rename = "organizationId")]
    pub organization_id: i64,

    /// Rank scope field on model ranking refresh trigger response.
    #[serde(rename = "rankScope")]
    pub rank_scope: String,

    /// Refresh interval seconds field on model ranking refresh trigger response.
    #[serde(rename = "refreshIntervalSeconds")]
    pub refresh_interval_seconds: i64,

    /// Snapshot date field on model ranking refresh trigger response.
    #[serde(rename = "snapshotDate")]
    pub snapshot_date: String,

    /// Snapshot period field on model ranking refresh trigger response.
    #[serde(rename = "snapshotPeriod")]
    pub snapshot_period: String,

    /// Source count field on model ranking refresh trigger response.
    #[serde(rename = "sourceCount")]
    pub source_count: i64,

    /// Result of the manual ranking worker run.
    pub status: String,

    /// Tenant id field on model ranking refresh trigger response.
    #[serde(rename = "tenantId")]
    pub tenant_id: i64,

    /// Whether a manual refresh worker run was started.
    pub triggered: bool,

    /// Window end field on model ranking refresh trigger response.
    #[serde(rename = "windowEnd")]
    pub window_end: String,

    /// Window start field on model ranking refresh trigger response.
    #[serde(rename = "windowStart")]
    pub window_start: String,
}
