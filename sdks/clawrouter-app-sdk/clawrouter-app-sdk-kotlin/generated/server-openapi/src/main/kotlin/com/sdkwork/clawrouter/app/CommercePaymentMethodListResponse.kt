package com.sdkwork.clawrouter.app

data class CommercePaymentMethodListResponse(
    val items: List<CommercePaymentMethodItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
