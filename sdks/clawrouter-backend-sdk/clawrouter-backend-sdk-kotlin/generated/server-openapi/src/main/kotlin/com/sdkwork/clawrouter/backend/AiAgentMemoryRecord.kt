package com.sdkwork.clawrouter.backend

data class AiAgentMemoryRecord(
    val agentId: String? = null,
    val contentRef: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val embeddingRef: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val lastUsedAt: String? = null,
    val memoryHash: String? = null,
    val memoryScope: String? = null,
    val memoryType: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val ownerUserId: String? = null,
    val retentionPolicy: Map<String, String>? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
