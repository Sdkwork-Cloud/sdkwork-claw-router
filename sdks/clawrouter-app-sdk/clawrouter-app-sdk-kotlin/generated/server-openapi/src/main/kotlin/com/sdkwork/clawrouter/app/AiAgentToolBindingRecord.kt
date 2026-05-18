package com.sdkwork.clawrouter.app

data class AiAgentToolBindingRecord(
    val agentId: String? = null,
    val agentVersionId: String? = null,
    val bindingKey: String? = null,
    val bindingType: String? = null,
    val createdAt: String? = null,
    val credentialRef: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val enabled: Boolean? = null,
    val healthStatus: String? = null,
    val id: String? = null,
    val lastCheckedAt: String? = null,
    val mcpServerId: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val permissionPolicy: Map<String, String>? = null,
    val runtimeConfig: Map<String, String>? = null,
    val skillId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val toolName: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
