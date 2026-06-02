package com.sdkwork.clawrouter.app

data class AiPromptRecord(
    val categoryCode: String? = null,
    val categoryId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val deprecatedAt: String? = null,
    val description: String? = null,
    val id: String? = null,
    val latestVersionId: String? = null,
    val metadata: Map<String, String>? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val promptKey: String? = null,
    val promptType: String? = null,
    val publishedAt: String? = null,
    val publishedVersionId: String? = null,
    val status: String? = null,
    val tags: Map<String, String>? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val visibility: String? = null
)
