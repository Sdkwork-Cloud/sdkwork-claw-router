package com.sdkwork.clawrouter.backend

data class ModelRankingRefreshJobItem(
    val durationMs: Int? = null,
    val endedAt: String? = null,
    val failureCount: Int? = null,
    val failureReason: String? = null,
    val generatedCount: Int? = null,
    val id: String? = null,
    val jobName: String? = null,
    val nextRefreshAt: String? = null,
    val organizationId: Int? = null,
    val rankScope: String? = null,
    val snapshotDate: String? = null,
    val snapshotPeriod: String? = null,
    val sourceCount: Int? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val successCount: Int? = null,
    val tenantId: Int? = null,
    val windowEnd: String? = null,
    val windowStart: String? = null
)
