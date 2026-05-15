package com.sdkwork.clawrouter.app

data class RoutingUsageSnapshot(
    val chartData: List<Map<String, Any>>? = null,
    val modelStats: List<Map<String, Any>>? = null
)
