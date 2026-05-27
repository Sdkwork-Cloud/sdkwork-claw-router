package com.sdkwork.clawrouter.backend

data class AdminMcpBindingItem(
    val allowedTools: List<String>? = null,
    val createdAt: String? = null,
    val deniedTools: List<String>? = null,
    val enabled: Boolean? = null,
    val id: Int? = null,
    val organizationId: Int? = null,
    val ownerId: Int? = null,
    val ownerType: String? = null,
    val policyJson: Map<String, String>? = null,
    val priority: Int? = null,
    val serverId: Int? = null,
    val serverRevisionId: Int? = null,
    val snapshotJson: Map<String, String>? = null,
    val status: String? = null,
    val tenantId: Int? = null,
    val toolId: Int? = null,
    val updatedAt: String? = null,
    val uuid: String? = null
)
