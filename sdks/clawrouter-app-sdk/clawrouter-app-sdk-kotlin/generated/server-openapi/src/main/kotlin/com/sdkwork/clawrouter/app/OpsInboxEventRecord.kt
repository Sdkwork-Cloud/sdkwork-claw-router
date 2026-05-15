package com.sdkwork.clawrouter.app

data class OpsInboxEventRecord(
    val consumerName: String? = null,
    val createdAt: String? = null,
    val eventType: String? = null,
    val eventVersion: Int? = null,
    val failureReason: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val messageId: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val processStatus: String? = null,
    val processedAt: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val retryCount: Int? = null,
    val sourceSystem: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
