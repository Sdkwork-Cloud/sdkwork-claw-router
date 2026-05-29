package com.sdkwork.clawrouter.backend

data class AiResourceGroupItemRecord(
    val childResourceGroupCode: String? = null,
    val childResourceGroupId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val itemRole: String? = null,
    val itemType: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val resourceCode: String? = null,
    val resourceGroupCode: String? = null,
    val resourceGroupId: String? = null,
    val resourceId: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
