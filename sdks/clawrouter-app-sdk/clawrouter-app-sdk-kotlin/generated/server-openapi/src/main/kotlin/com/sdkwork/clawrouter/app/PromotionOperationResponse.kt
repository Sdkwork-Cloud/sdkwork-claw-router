package com.sdkwork.clawrouter.app

data class PromotionOperationResponse(
    val paymentId: String? = null,
    val qrCode: MediaResource? = null,
    val qrCodePayload: String? = null,
    val requestNo: String? = null,
    val status: String? = null,
    val success: Boolean? = null
)
