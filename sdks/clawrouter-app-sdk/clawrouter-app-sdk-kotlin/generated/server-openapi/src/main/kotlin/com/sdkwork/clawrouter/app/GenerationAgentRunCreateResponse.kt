package com.sdkwork.clawrouter.app

data class GenerationAgentRunCreateResponse(
    val agent: GenerationAgentSnapshot? = null,
    val item: GenerationHistoryItem? = null,
    val meteringEvents: List<GenerationAgentMeteringEvent>? = null,
    val run: GenerationAgentRunSnapshot? = null,
    val status: String? = null,
    val steps: List<GenerationAgentRunStepSnapshot>? = null,
    val targetType: String? = null,
    val usage: GenerationAgentUsageSummary? = null
)
