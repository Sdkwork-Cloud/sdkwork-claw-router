package com.sdkwork.clawrouter.backend

data class CommercePaymentIntentListResponse(
    val items: List<CommercePaymentIntentItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
