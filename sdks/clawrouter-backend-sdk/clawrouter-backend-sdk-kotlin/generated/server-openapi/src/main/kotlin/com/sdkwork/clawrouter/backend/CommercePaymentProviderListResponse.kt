package com.sdkwork.clawrouter.backend

data class CommercePaymentProviderListResponse(
    val items: List<CommercePaymentProviderItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
