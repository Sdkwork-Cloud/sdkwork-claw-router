package com.sdkwork.clawrouter.backend

data class ContentDocPageRecord(
    val contentHash: String? = null,
    val contentSource: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val docCode: String? = null,
    val docType: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val path: String? = null,
    val publishedAt: String? = null,
    val slug: String? = null,
    val sortOrder: Int? = null,
    val sourceRef: String? = null,
    val status: String? = null,
    val summary: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
