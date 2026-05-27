package com.sdkwork.clawrouter.backend

data class MessagingSendAttemptRecord(
    val createdAt: String? = null,
    val failureCode: String? = null,
    val failureMessageMasked: String? = null,
    val httpStatus: Int? = null,
    val id: String? = null,
    val latencyMs: Int? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val providerMessageId: String? = null,
    val providerRequestId: String? = null,
    val providerStatus: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val retryAfterAt: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
