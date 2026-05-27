package com.sdkwork.clawrouter.app

data class CommerceOperationResponse(
    val paymentId: String? = null,
    val qrCodeImageUrl: String? = null,
    val qrCodePayload: String? = null,
    val requestNo: String? = null,
    val status: String? = null,
    val success: Boolean? = null
)
