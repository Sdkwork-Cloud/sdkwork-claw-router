package com.sdkwork.clawrouter.backend

data class AdminMcpDiscoveryResponse(
    val checkedAt: String? = null,
    val discoveredCount: Int? = null,
    val serverId: Int? = null,
    val tools: List<AdminMcpToolItem>? = null
)
