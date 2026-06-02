package com.sdkwork.clawrouter.app

data class MessagingDeliveryEventRecord(
    val createdAt: String? = null,
    val eventAt: String? = null,
    val eventType: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val payloadRedacted: Map<String, String>? = null,
    val providerCode: String? = null,
    val providerEventId: String? = null,
    val providerMessageId: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val sendAttemptId: String? = null,
    val sendRequestId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
