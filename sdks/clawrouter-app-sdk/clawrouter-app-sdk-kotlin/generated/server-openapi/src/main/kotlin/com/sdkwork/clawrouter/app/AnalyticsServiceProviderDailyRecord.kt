package com.sdkwork.clawrouter.app

data class AnalyticsServiceProviderDailyRecord(
    val ancestorProviderId: String? = null,
    val createdAt: String? = null,
    val currency: String? = null,
    val expenseAmount: String? = null,
    val failureCount: String? = null,
    val id: String? = null,
    val incomeAmount: String? = null,
    val marginAmount: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerId: String? = null,
    val rebuildVersion: String? = null,
    val reportDate: String? = null,
    val requestCount: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val sourceVersion: String? = null,
    val status: String? = null,
    val successCount: String? = null,
    val tenantId: String? = null,
    val tokenCount: String? = null,
    val updatedAt: String? = null,
    val upstreamCostAmount: String? = null,
    val uuid: String? = null
)
