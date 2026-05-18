package com.sdkwork.clawrouter.app

data class GenerationAgentUsageSummary(
    val cachedTokens: Int? = null,
    val completionTokens: Int? = null,
    val events: List<GenerationAgentMeteringEvent>? = null,
    val imageCount: Int? = null,
    val promptTokens: Int? = null,
    val totalTokens: Int? = null,
    val videoSeconds: String? = null
)
