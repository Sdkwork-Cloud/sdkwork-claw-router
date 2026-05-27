package com.sdkwork.clawrouter.backend

data class ObjectBucketRecord(
    val bucketName: String? = null,
    val bucketRegion: String? = null,
    val createdAt: String? = null,
    val dataResidencyRegion: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val kmsKeyRef: String? = null,
    val logicalScope: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerId: String? = null,
    val requestId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
