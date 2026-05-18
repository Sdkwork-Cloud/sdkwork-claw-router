package com.sdkwork.clawrouter.backend

data class AiAgentMcpServerRecord(
    val connectionConfig: Map<String, String>? = null,
    val createdAt: String? = null,
    val credentialRef: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val description: String? = null,
    val healthStatus: String? = null,
    val id: String? = null,
    val lastCheckedAt: String? = null,
    val lastErrorMasked: String? = null,
    val metadata: Map<String, String>? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val permissionPolicy: Map<String, String>? = null,
    val promptCatalog: Map<String, String>? = null,
    val resourceCatalog: Map<String, String>? = null,
    val serverCode: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val toolCatalog: Map<String, String>? = null,
    val transportType: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
