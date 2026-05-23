package com.sdkwork.clawrouter.backend

data class OpenPlatformProviderRecord(
    val capabilities: Map<String, String>? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val docsUrl: String? = null,
    val iconUrl: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val provider: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val websiteUrl: String? = null
)
