package com.sdkwork.clawrouter.backend

data class ModelRankingRefreshStatus(
    val cacheMaxAgeSeconds: Int? = null,
    val generatedAt: String? = null,
    val generatedCount: Int? = null,
    val latestJob: ModelRankingRefreshLatestJob? = null,
    val nextRefreshAt: String? = null,
    val organizationId: Int? = null,
    val rankScope: String? = null,
    val refreshIntervalSeconds: Int? = null,
    val snapshotDate: String? = null,
    val snapshotPeriod: String? = null,
    val sourceCount: Int? = null,
    val sourceTables: List<String>? = null,
    val status: String? = null,
    val tenantId: Int? = null,
    val windowEnd: String? = null,
    val windowStart: String? = null
)
