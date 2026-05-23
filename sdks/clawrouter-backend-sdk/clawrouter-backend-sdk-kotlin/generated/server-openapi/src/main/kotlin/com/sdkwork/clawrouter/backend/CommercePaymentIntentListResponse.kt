package com.sdkwork.clawrouter.backend

data class CommercePaymentIntentListResponse(
    val items: List<CommercePaymentIntentItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
