package com.sdkwork.clawrouter.backend

data class MessagingTemplateVersionRecord(
    val contentHash: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val htmlTemplate: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val publishedAt: String? = null,
    val renderEngine: String? = null,
    val retiredAt: String? = null,
    val reviewStatus: String? = null,
    val status: String? = null,
    val subjectTemplate: String? = null,
    val templateId: String? = null,
    val tenantId: String? = null,
    val textTemplate: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val variableSchema: Map<String, String>? = null,
    val version: String? = null,
    val versionNo: Int? = null
)
