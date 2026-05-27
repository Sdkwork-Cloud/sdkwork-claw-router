package com.sdkwork.clawrouter.app

data class PromotionCommandRequest(
    val clientRequestNo: String? = null,
    val metadata: Map<String, String>? = null,
    val note: String? = null
)
