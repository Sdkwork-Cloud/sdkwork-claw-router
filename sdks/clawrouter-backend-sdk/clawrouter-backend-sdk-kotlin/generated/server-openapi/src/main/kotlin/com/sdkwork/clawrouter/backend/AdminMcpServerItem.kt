package com.sdkwork.clawrouter.backend

data class AdminMcpServerItem(
    val categoryCode: String? = null,
    val categoryId: String? = null,
    val createdAt: String? = null,
    val deprecatedAt: String? = null,
    val description: String? = null,
    val healthStatus: String? = null,
    val id: Int? = null,
    val lastCheckedAt: String? = null,
    val lastErrorMasked: String? = null,
    val latestRevisionId: Int? = null,
    val name: String? = null,
    val organizationId: Int? = null,
    val ownerUserId: Int? = null,
    val publishedAt: String? = null,
    val publishedRevisionId: Int? = null,
    val serverKey: String? = null,
    val status: String? = null,
    val tags: List<String>? = null,
    val tenantId: Int? = null,
    val transport: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val visibility: String? = null
)
