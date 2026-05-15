package com.sdkwork.clawrouter.app

data class RoutingStrategySnapshot(
    val mappingRules: List<Map<String, Any>>? = null,
    val strategy: String? = null
)
