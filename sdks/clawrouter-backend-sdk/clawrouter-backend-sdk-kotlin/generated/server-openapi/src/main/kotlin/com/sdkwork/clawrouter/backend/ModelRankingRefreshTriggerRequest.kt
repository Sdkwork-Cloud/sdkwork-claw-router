package com.sdkwork.clawrouter.backend

data class ModelRankingRefreshTriggerRequest(
    val cacheMaxAgeSeconds: Int? = null,
    val limit: Int? = null,
    val lookbackDays: Int? = null,
    val rankScope: String? = null,
    val refreshIntervalSeconds: Int? = null,
    val snapshotPeriod: String? = null
)
