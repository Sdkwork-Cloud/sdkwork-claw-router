package com.sdkwork.clawrouter.app

data class GenerationAgentMeteringEvent(
    val quantity: String? = null,
    val type: String? = null,
    val usageFactMetadata: GenerationAgentUsageFactMetadata? = null
)
