package com.sdkwork.clawrouter.app

data class CommercePaymentIntentRecord(
    val amount: String? = null,
    val capturedAmount: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val merchantOrderNo: String? = null,
    val metadataJson: String? = null,
    val nextActionJson: String? = null,
    val orderId: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val paymentMethod: String? = null,
    val provider: String? = null,
    val providerCode: String? = null,
    val providerNativeJson: String? = null,
    val refundedAmount: String? = null,
    val requestNo: String? = null,
    val sceneCode: String? = null,
    val status: String? = null,
    val subject: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
