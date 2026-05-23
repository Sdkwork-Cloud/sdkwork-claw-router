package com.sdkwork.clawrouter.backend

data class CommerceOrderAmountBreakdownRecord(
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val discountAmount: String? = null,
    val orderId: String? = null,
    val originalAmount: String? = null,
    val payableAmount: String? = null,
    val tenantId: String? = null
)
