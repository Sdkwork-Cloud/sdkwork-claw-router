package com.sdkwork.clawrouter.app

data class StorageReconciliationItemRecord(
    val actualHash: String? = null,
    val actualSizeBytes: String? = null,
    val bucketId: String? = null,
    val createdAt: String? = null,
    val expectedHash: String? = null,
    val expectedSizeBytes: String? = null,
    val id: String? = null,
    val issueType: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val objectBlobId: String? = null,
    val objectKey: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val repairPayload: Map<String, String>? = null,
    val repairStatus: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val runId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
