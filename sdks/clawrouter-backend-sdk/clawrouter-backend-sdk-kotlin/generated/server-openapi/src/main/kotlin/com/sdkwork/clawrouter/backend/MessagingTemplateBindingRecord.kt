package com.sdkwork.clawrouter.backend

data class MessagingTemplateBindingRecord(
    val approvalStatus: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val lastSyncedAt: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val providerPayload: Map<String, String>? = null,
    val providerTemplateCode: String? = null,
    val providerTemplateVersion: String? = null,
    val rejectionReason: String? = null,
    val status: String? = null,
    val syncPayloadHash: String? = null,
    val templateVariantId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
