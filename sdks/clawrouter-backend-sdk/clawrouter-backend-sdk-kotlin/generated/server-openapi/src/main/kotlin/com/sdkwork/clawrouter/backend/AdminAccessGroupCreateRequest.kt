package com.sdkwork.clawrouter.backend

data class AdminAccessGroupCreateRequest(
    val billingType: String? = null,
    val capacity: Map<String, Any>? = null,
    val name: String? = null,
    val platform: String? = null,
    val rateMultiplier: Double? = null,
    val status: String? = null,
    val type: String? = null
)
