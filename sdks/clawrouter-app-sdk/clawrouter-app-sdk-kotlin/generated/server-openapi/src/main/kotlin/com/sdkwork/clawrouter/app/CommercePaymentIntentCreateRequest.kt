package com.sdkwork.clawrouter.app

data class CommercePaymentIntentCreateRequest(
    val amount: String? = null,
    val checkoutSessionId: String? = null,
    val clientRequestNo: String? = null,
    val currencyCode: String? = null,
    val methodCode: String? = null,
    val note: String? = null,
    val orderId: String? = null,
    val subjectType: String? = null
)
