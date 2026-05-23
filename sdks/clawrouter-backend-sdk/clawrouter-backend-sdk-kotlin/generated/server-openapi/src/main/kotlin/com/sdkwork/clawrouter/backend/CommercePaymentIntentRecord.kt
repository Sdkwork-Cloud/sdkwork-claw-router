package com.sdkwork.clawrouter.backend

data class CommercePaymentIntentRecord(
    val amount: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val idempotencyKey: String? = null,
    val orderId: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val provider: String? = null,
    val requestNo: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
