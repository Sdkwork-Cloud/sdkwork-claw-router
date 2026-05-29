package com.sdkwork.clawrouter.backend

data class MessagingProviderAccountRecord(
    val authType: String? = null,
    val baseUrl: String? = null,
    val createdAt: String? = null,
    val credentialHash: String? = null,
    val credentialRef: String? = null,
    val credentialVersion: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val deliveryPurpose: String? = null,
    val id: String? = null,
    val lastUsedAt: String? = null,
    val lastVerifiedAt: String? = null,
    val maskedLabel: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
