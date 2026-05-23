package com.sdkwork.clawrouter.backend

data class AdminAnalyticsSummary(
    val activeModels: Int? = null,
    val activeUsers: Int? = null,
    val averagePointsPerRequest: Double? = null,
    val averageTokensPerRequest: Double? = null,
    val errorRate: Double? = null,
    val failedRequests: Int? = null,
    val successfulRequests: Int? = null,
    val totalPoints: Double? = null,
    val totalRequests: Int? = null,
    val totalTokens: Double? = null,
    val totalUsers: Int? = null,
    val upstreamCost: Double? = null
)
