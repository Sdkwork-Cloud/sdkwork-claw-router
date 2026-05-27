package com.sdkwork.clawrouter.app

data class CommerceCheckoutQuoteRecord(
    val checkoutSessionId: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val expiresAt: String? = null,
    val organizationId: String? = null,
    val originalAmount: String? = null,
    val payableAmount: String? = null,
    val quoteNo: String? = null,
    val tenantId: String? = null
)
