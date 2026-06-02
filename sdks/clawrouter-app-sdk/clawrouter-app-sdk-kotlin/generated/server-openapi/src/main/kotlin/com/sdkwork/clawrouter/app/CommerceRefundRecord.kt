package com.sdkwork.clawrouter.app

data class CommerceRefundRecord(
    val amount: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val organizationId: String? = null,
    val paymentAttemptId: String? = null,
    val paymentIntentId: String? = null,
    val providerCode: String? = null,
    val reason: String? = null,
    val refundNo: String? = null,
    val requestNo: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
