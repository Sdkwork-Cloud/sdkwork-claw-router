package com.sdkwork.clawrouter.app

data class MessagingProviderRecord(
    val channel: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val displayName: String? = null,
    val docsUrl: String? = null,
    val icon: MediaResource? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val metadataSchemaVersion: String? = null,
    val organizationId: String? = null,
    val providerCode: String? = null,
    val providerType: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val websiteUrl: String? = null
)
