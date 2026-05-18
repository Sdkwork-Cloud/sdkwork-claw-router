package com.sdkwork.clawrouter.app

data class DashboardOverviewSummary(
    val audioRequests: Int? = null,
    val availableCredits: Double? = null,
    val errorCount: Int? = null,
    val imageRequests: Int? = null,
    val musicRequests: Int? = null,
    val requestCount: Int? = null,
    val rpm: Double? = null,
    val totalRequestCount: Int? = null,
    val totalUsedCredits: Double? = null,
    val tpm: Double? = null,
    val usedCredits: Double? = null,
    val videoRequests: Int? = null
)
