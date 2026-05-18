package com.sdkwork.clawrouter.backend

data class AiAgentVersionRecord(
    val agentId: String? = null,
    val configHash: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val mcpPolicy: Map<String, String>? = null,
    val memoryPolicy: Map<String, String>? = null,
    val metadata: Map<String, String>? = null,
    val modelPolicy: Map<String, String>? = null,
    val organizationId: String? = null,
    val publishedAt: String? = null,
    val publishedBy: String? = null,
    val releaseStatus: String? = null,
    val runtimePolicy: Map<String, String>? = null,
    val skillPolicy: Map<String, String>? = null,
    val status: String? = null,
    val systemPrompt: String? = null,
    val tenantId: String? = null,
    val toolPolicy: Map<String, String>? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val versionNo: String? = null
)
