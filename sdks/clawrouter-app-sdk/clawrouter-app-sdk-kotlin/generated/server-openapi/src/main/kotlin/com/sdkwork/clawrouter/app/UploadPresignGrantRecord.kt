package com.sdkwork.clawrouter.app

data class UploadPresignGrantRecord(
    val bucketId: String? = null,
    val canonicalHeaders: Map<String, String>? = null,
    val consumedAt: String? = null,
    val createdAt: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val method: String? = null,
    val objectKey: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val providerId: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val signedHeaders: Map<String, String>? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val uploadPartId: String? = null,
    val uploadSessionId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
