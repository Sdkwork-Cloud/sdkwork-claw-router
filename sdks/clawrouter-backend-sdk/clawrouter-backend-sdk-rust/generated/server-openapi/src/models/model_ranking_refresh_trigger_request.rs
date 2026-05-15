use serde::{Deserialize, Serialize};

/// Model ranking refresh trigger request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ModelRankingRefreshTriggerRequest {
    /// Cache freshness contract for ranking readers after this refresh.
    #[serde(rename = "cacheMaxAgeSeconds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cache_max_age_seconds: Option<i64>,

    /// Maximum ranking rows to generate.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub limit: Option<i64>,

    /// Source usage lookback window in days.
    #[serde(rename = "lookbackDays")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lookback_days: Option<i64>,

    /// Ranking scope to regenerate. Defaults to commercial-default.
    #[serde(rename = "rankScope")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rank_scope: Option<String>,

    /// Planned interval used for audit metadata and next refresh time.
    #[serde(rename = "refreshIntervalSeconds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refresh_interval_seconds: Option<i64>,

    /// Snapshot granularity used by the ranking worker.
    #[serde(rename = "snapshotPeriod")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_period: Option<String>,
}
