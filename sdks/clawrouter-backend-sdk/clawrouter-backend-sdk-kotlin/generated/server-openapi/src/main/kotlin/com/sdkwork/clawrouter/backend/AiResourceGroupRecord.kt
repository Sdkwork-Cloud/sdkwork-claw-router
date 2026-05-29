package com.sdkwork.clawrouter.backend

data class AiResourceGroupRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val description: String? = null,
    val groupCode: String? = null,
    val groupName: String? = null,
    val groupType: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val selectionMode: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
