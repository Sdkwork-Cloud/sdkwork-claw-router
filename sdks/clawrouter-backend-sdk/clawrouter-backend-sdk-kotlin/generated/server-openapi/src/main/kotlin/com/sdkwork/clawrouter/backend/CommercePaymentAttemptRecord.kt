package com.sdkwork.clawrouter.backend

data class CommercePaymentAttemptRecord(
    val amount: String? = null,
    val callbackPayload: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val id: String? = null,
    val orderId: String? = null,
    val organizationId: String? = null,
    val outTradeNo: String? = null,
    val ownerUserId: String? = null,
    val paidAt: String? = null,
    val paymentIntentId: String? = null,
    val provider: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
