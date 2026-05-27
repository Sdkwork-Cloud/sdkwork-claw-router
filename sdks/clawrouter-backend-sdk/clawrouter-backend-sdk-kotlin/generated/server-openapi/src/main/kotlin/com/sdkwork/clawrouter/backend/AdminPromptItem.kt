package com.sdkwork.clawrouter.backend

data class AdminPromptItem(
    val categoryCode: String? = null,
    val categoryId: String? = null,
    val createdAt: String? = null,
    val description: String? = null,
    val id: Int? = null,
    val latestVersionId: Int? = null,
    val name: String? = null,
    val organizationId: Int? = null,
    val ownerUserId: Int? = null,
    val promptKey: String? = null,
    val promptType: String? = null,
    val publishedVersionId: Int? = null,
    val status: String? = null,
    val tags: List<String>? = null,
    val tenantId: Int? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val visibility: String? = null
)
