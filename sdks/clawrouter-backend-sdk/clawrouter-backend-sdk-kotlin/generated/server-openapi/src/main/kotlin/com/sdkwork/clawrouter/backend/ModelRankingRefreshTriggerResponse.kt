package com.sdkwork.clawrouter.backend

data class ModelRankingRefreshTriggerResponse(
    val cacheMaxAgeSeconds: Int? = null,
    val generatedCount: Int? = null,
    val nextRefreshAt: String? = null,
    val organizationId: Int? = null,
    val rankScope: String? = null,
    val refreshIntervalSeconds: Int? = null,
    val snapshotDate: String? = null,
    val snapshotPeriod: String? = null,
    val sourceCount: Int? = null,
    val status: String? = null,
    val tenantId: Int? = null,
    val triggered: Boolean? = null,
    val windowEnd: String? = null,
    val windowStart: String? = null
)
