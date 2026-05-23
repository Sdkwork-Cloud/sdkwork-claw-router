package com.sdkwork.clawrouter.app

data class UsageSnapshot(
    val cachedTokens: Int? = null,
    val inputTokens: Int? = null,
    val outputTokens: Int? = null,
    val totalTokens: Int? = null
)
