package com.sdkwork.clawrouter.backend

data class AiMemoryEmbeddingRecord(
    val contentHash: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val embeddingDimensions: Int? = null,
    val embeddingModel: String? = null,
    val embeddingProvider: String? = null,
    val id: String? = null,
    val indexedAt: String? = null,
    val memoryId: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val vectorJson: Map<String, String>? = null,
    val vectorStorageKey: String? = null,
    val version: String? = null
)
