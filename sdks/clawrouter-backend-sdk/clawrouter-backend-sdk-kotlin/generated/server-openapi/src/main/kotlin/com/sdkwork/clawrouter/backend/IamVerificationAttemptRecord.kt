package com.sdkwork.clawrouter.backend

data class IamVerificationAttemptRecord(
    val challengeId: String? = null,
    val createdAt: String? = null,
    val deviceHash: String? = null,
    val failureReason: String? = null,
    val id: String? = null,
    val ipHash: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val occurredAt: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val requestId: String? = null,
    val result: String? = null,
    val retentionUntil: String? = null,
    val riskSnapshot: Map<String, String>? = null,
    val sceneCode: String? = null,
    val status: String? = null,
    val targetHash: String? = null,
    val targetType: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
