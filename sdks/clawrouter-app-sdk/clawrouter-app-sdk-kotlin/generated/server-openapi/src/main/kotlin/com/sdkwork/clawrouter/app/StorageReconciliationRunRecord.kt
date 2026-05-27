package com.sdkwork.clawrouter.app

data class StorageReconciliationRunRecord(
    val bucketId: String? = null,
    val checkMode: String? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerId: String? = null,
    val requestId: String? = null,
    val requestedBy: String? = null,
    val runType: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
