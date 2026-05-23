package com.sdkwork.clawrouter.backend

data class CommercePaymentWebhookEventRecord(
    val createdAt: String? = null,
    val eventId: String? = null,
    val idempotencyKey: String? = null,
    val message: String? = null,
    val nonce: String? = null,
    val organizationId: String? = null,
    val outTradeNo: String? = null,
    val payloadDigest: String? = null,
    val processedAt: String? = null,
    val provider: String? = null,
    val requestNo: String? = null,
    val requestTimestamp: String? = null,
    val signature: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val transactionId: String? = null,
    val updatedAt: String? = null
)
