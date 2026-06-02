package com.sdkwork.clawrouter.app

data class CommerceRechargeOrderCreateResponse(
    val amount: String? = null,
    val cashierUrl: String? = null,
    val currencyCode: String? = null,
    val nextAction: String? = null,
    val orderNo: String? = null,
    val paymentMethod: String? = null,
    val paymentProduct: String? = null,
    val points: Int? = null,
    val providerCode: String? = null,
    val qrCodePayload: String? = null,
    val requestPaymentPayload: Map<String, String>? = null,
    val status: String? = null,
    val success: Boolean? = null
)
