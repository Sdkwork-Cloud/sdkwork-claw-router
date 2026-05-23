use serde::{Deserialize, Serialize};

/// Admin cache summary schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCacheSummary {
    /// Cache deletes field on admin cache summary.
    #[serde(rename = "cacheDeletes")]
    pub cache_deletes: i64,

    /// Cache errors field on admin cache summary.
    #[serde(rename = "cacheErrors")]
    pub cache_errors: i64,

    /// Cache hits field on admin cache summary.
    #[serde(rename = "cacheHits")]
    pub cache_hits: i64,

    /// Cache inspections field on admin cache summary.
    #[serde(rename = "cacheInspections")]
    pub cache_inspections: i64,

    /// Cache misses field on admin cache summary.
    #[serde(rename = "cacheMisses")]
    pub cache_misses: i64,

    /// Cache refreshes field on admin cache summary.
    #[serde(rename = "cacheRefreshes")]
    pub cache_refreshes: i64,

    /// Cache writes field on admin cache summary.
    #[serde(rename = "cacheWrites")]
    pub cache_writes: i64,

    /// Expired entries field on admin cache summary.
    #[serde(rename = "expiredEntries")]
    pub expired_entries: i64,

    /// Runtime target field on admin cache summary.
    #[serde(rename = "runtimeTarget")]
    pub runtime_target: String,

    /// Total entries field on admin cache summary.
    #[serde(rename = "totalEntries")]
    pub total_entries: i64,

    /// Total instances field on admin cache summary.
    #[serde(rename = "totalInstances")]
    pub total_instances: i64,

    /// Total namespaces field on admin cache summary.
    #[serde(rename = "totalNamespaces")]
    pub total_namespaces: i64,
}
