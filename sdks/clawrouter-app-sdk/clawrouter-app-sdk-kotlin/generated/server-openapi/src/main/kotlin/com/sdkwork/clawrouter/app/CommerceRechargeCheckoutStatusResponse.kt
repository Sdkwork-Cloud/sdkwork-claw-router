package com.sdkwork.clawrouter.app

data class CommerceRechargeCheckoutStatusResponse(
    val amount: String? = null,
    val cashierUrl: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val expiresAt: String? = null,
    val nextAction: String? = null,
    val orderNo: String? = null,
    val orderStatus: String? = null,
    val outTradeNo: String? = null,
    val paidAt: String? = null,
    val paymentMethod: String? = null,
    val paymentProduct: String? = null,
    val paymentStatus: String? = null,
    val points: Int? = null,
    val providerCode: String? = null,
    val qrCodePayload: String? = null,
    val rechargeStatus: String? = null,
    val requestPaymentPayload: Map<String, String>? = null,
    val status: String? = null
)
