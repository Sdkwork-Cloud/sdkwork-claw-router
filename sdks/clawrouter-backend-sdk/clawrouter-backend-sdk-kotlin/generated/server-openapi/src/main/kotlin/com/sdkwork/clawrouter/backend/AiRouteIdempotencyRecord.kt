package com.sdkwork.clawrouter.backend

data class AiRouteIdempotencyRecord(
    val apiKeyId: String? = null,
    val channelGroupId: String? = null,
    val channelId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val endpointId: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val metadata: Map<String, String>? = null,
    val objectId: String? = null,
    val objectType: String? = null,
    val organizationId: String? = null,
    val requestHash: String? = null,
    val responseStatus: Int? = null,
    val routeStrategy: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
