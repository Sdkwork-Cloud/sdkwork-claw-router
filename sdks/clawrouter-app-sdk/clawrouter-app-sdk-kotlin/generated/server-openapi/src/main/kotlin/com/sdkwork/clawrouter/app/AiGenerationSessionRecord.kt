package com.sdkwork.clawrouter.app

data class AiGenerationSessionRecord(
    val activeModality: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val filterConfig: Map<String, String>? = null,
    val id: String? = null,
    val lastOpenedAt: String? = null,
    val lastPrompt: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val selectedModels: Map<String, String>? = null,
    val sessionCode: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
