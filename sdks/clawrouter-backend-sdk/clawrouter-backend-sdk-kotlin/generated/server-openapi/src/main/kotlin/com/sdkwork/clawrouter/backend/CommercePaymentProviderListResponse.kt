package com.sdkwork.clawrouter.backend

data class CommercePaymentProviderListResponse(
    val items: List<CommercePaymentProviderItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
