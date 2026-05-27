package com.sdkwork.clawrouter.backend

data class AdminMcpToolItem(
    val createdAt: String? = null,
    val description: String? = null,
    val discoveredAt: String? = null,
    val enabled: Boolean? = null,
    val id: Int? = null,
    val inputSchema: Map<String, String>? = null,
    val lastInvokedAt: String? = null,
    val name: String? = null,
    val organizationId: Int? = null,
    val outputSchema: Map<String, String>? = null,
    val rateLimitPolicy: Map<String, String>? = null,
    val requiresApproval: Boolean? = null,
    val riskLevel: String? = null,
    val schemaHash: String? = null,
    val serverId: Int? = null,
    val serverRevisionId: Int? = null,
    val sortWeight: Int? = null,
    val status: String? = null,
    val tenantId: Int? = null,
    val toolKey: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null
)
