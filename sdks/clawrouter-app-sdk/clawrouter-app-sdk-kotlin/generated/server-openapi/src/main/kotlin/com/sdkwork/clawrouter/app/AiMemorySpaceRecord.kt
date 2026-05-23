package com.sdkwork.clawrouter.app

data class AiMemorySpaceRecord(
    val autoExtractEnabled: Boolean? = null,
    val autoRecallEnabled: Boolean? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val entryCount: String? = null,
    val id: String? = null,
    val maxInjectedTokens: String? = null,
    val memoryEnabled: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val retentionPolicy: Map<String, String>? = null,
    val reviewRequired: Boolean? = null,
    val sensitivityPolicy: Map<String, String>? = null,
    val spaceType: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
