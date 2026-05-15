package com.sdkwork.clawrouter.app

data class SubmitRechargeResponse(
    val amount: String? = null,
    val orderNo: String? = null,
    val paymentMethod: String? = null,
    val points: Int? = null,
    val status: String? = null,
    val success: Boolean? = null
)
