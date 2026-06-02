package com.sdkwork.clawrouter.app

data class CommercePaymentFeeRecord(
    val amount: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val feeType: String? = null,
    val id: String? = null,
    val occurredAt: String? = null,
    val organizationId: String? = null,
    val paymentAttemptId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val refundId: String? = null,
    val statementItemId: String? = null,
    val tenantId: String? = null
)
