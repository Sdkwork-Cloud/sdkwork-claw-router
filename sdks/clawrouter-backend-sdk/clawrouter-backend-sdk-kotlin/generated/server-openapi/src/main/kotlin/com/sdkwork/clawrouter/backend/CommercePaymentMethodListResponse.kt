package com.sdkwork.clawrouter.backend

data class CommercePaymentMethodListResponse(
    val items: List<CommercePaymentMethodItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
