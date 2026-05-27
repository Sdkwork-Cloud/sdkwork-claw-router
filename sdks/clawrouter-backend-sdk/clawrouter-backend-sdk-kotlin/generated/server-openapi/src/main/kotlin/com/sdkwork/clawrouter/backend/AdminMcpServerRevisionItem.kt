package com.sdkwork.clawrouter.backend

data class AdminMcpServerRevisionItem(
    val argsJson: List<String>? = null,
    val authType: String? = null,
    val command: String? = null,
    val configHash: String? = null,
    val createdAt: String? = null,
    val createdBy: Int? = null,
    val deprecatedAt: String? = null,
    val endpointUrl: String? = null,
    val envSchema: Map<String, String>? = null,
    val id: Int? = null,
    val lifecycleStatus: String? = null,
    val organizationId: Int? = null,
    val publishedAt: String? = null,
    val retryPolicy: Map<String, String>? = null,
    val revisionNo: String? = null,
    val secretRef: String? = null,
    val serverId: Int? = null,
    val status: String? = null,
    val tenantId: Int? = null,
    val timeoutMs: Int? = null,
    val transport: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null
)
