package com.sdkwork.clawrouter.backend

data class MessagingTemplateRecord(
    val category: String? = null,
    val channel: String? = null,
    val createdAt: String? = null,
    val currentVersionId: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val deliveryPurpose: String? = null,
    val description: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val ownerAppId: String? = null,
    val publishStatus: String? = null,
    val sceneCode: String? = null,
    val status: String? = null,
    val templateCode: String? = null,
    val templateName: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
