package com.sdkwork.clawrouter.app

data class MessagingRateLimitBucketRecord(
    val channel: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val deviceHash: String? = null,
    val id: String? = null,
    val ipHash: String? = null,
    val lastEventAt: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val rejectCount: Int? = null,
    val sceneCode: String? = null,
    val sendCount: Int? = null,
    val status: String? = null,
    val targetHash: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val verifyCount: Int? = null,
    val version: String? = null,
    val windowSeconds: Int? = null,
    val windowStart: String? = null
)
