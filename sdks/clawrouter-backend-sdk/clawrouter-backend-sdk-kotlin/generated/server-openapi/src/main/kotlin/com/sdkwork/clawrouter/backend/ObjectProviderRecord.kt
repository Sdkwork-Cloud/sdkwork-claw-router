package com.sdkwork.clawrouter.backend

data class ObjectProviderRecord(
    val createdAt: String? = null,
    val credentialRef: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val endpointUrl: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val lastHealthCheckAt: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerCode: String? = null,
    val providerType: String? = null,
    val region: String? = null,
    val requestId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
