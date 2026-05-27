package com.sdkwork.clawrouter.app

data class StorageQuotaPolicyRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val enforcement: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val quotaLimitBytes: String? = null,
    val requestId: String? = null,
    val scopeId: String? = null,
    val scopeType: String? = null,
    val singleFileLimitBytes: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
