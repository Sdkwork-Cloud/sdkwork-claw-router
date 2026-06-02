package com.sdkwork.clawrouter.backend

data class CommerceCheckoutQuoteRecord(
    val checkoutSessionId: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val discountAmount: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val organizationId: String? = null,
    val originalAmount: String? = null,
    val payableAmount: String? = null,
    val quoteNo: String? = null,
    val shippingAmount: String? = null,
    val taxAmount: String? = null,
    val tenantId: String? = null
)
