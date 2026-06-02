package com.sdkwork.clawrouter.backend

data class MessagingTemplateVariantRecord(
    val bodyTemplate: String? = null,
    val channel: String? = null,
    val contentFormat: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val lengthLimit: Int? = null,
    val locale: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerPayloadSchema: Map<String, String>? = null,
    val renderOptions: Map<String, String>? = null,
    val status: String? = null,
    val templateVersionId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
