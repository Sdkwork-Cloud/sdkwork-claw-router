package com.sdkwork.clawrouter.backend

data class AiApiEndpointRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val displayName: String? = null,
    val endpointCode: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val method: String? = null,
    val organizationId: String? = null,
    val pathTemplate: String? = null,
    val protocolCode: String? = null,
    val requestSchema: Map<String, String>? = null,
    val responseSchema: Map<String, String>? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val streamingSupported: Boolean? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
