package com.sdkwork.clawrouter.app

data class AiRateLimitBucketRecord(
    val bucketKey: String? = null,
    val createdAt: String? = null,
    val currentCount: String? = null,
    val currentTokens: String? = null,
    val id: String? = null,
    val lastRequestAt: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val quotaPolicyId: String? = null,
    val rebuildVersion: String? = null,
    val remainingCount: String? = null,
    val remainingTokens: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val sourceVersion: String? = null,
    val status: String? = null,
    val subjectId: String? = null,
    val subjectType: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val windowEnd: String? = null,
    val windowStart: String? = null
)
