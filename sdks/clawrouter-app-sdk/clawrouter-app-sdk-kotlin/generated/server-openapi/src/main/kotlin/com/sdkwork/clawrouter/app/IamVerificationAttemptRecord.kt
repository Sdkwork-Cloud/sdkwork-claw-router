package com.sdkwork.clawrouter.app

data class IamVerificationAttemptRecord(
    val createdAt: String? = null,
    val deviceHash: String? = null,
    val failureReason: String? = null,
    val id: String? = null,
    val ipHash: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
