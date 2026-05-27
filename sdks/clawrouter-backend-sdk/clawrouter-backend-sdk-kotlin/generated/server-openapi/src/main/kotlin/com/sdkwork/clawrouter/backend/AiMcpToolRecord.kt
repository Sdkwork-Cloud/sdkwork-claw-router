package com.sdkwork.clawrouter.backend

data class AiMcpToolRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val description: String? = null,
    val discoveredAt: String? = null,
    val id: String? = null,
    val lastInvokedAt: String? = null,
    val metadata: Map<String, String>? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val schemaHash: String? = null,
    val serverId: String? = null,
    val serverRevisionId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val toolKey: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
