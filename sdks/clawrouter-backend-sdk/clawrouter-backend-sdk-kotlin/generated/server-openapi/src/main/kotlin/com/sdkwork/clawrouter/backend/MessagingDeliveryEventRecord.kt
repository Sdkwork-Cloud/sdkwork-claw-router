package com.sdkwork.clawrouter.backend

data class MessagingDeliveryEventRecord(
    val createdAt: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val providerMessageId: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val sendAttemptId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
