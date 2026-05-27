package com.sdkwork.clawrouter.app

data class PromotionCodeRedemptionRequest(
    val clientRequestNo: String? = null,
    val code: String? = null,
    val note: String? = null,
    val scene: String? = null,
    val source: String? = null
)
