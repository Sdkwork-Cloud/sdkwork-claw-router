package com.sdkwork.clawrouter.app

data class AiModelApiEndpointRecord(
    val apiEndpointId: String? = null,
    val catalogKey: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val defaultParameters: Map<String, String>? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val endpointCode: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val model: String? = null,
    val modelId: String? = null,
    val organizationId: String? = null,
    val providerNativeModel: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val supported: Boolean? = null,
    val supportsStreaming: Boolean? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val vendorCode: String? = null,
    val version: String? = null
)
