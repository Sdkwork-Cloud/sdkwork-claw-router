package com.sdkwork.clawrouter.app

data class StorageGcJobRecord(
    val candidateCount: String? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val criteriaJson: Map<String, String>? = null,
    val cursorToken: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val deletedObjectCount: String? = null,
    val dryRun: Boolean? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val jobType: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val releasedBytes: String? = null,
    val requestId: String? = null,
    val requestedBy: String? = null,
    val resultJson: Map<String, String>? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
