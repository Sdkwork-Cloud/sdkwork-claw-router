package com.sdkwork.clawrouter.app

data class CheckoutStatusResponse(
    val amount: String? = null,
    val createdAt: String? = null,
    val expiresAt: String? = null,
    val nextAction: String? = null,
    val orderNo: String? = null,
    val orderStatus: String? = null,
    val outTradeNo: String? = null,
    val paidAt: String? = null,
    val paymentMethod: String? = null,
    val paymentStatus: String? = null,
    val points: Int? = null,
    val qrCodePayload: String? = null,
    val rechargeStatus: String? = null,
    val status: String? = null
)
