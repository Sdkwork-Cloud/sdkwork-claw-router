package com.sdkwork.clawrouter.backend

data class CommercePaymentProviderAccountListResponse(
    val items: List<CommercePaymentProviderAccountItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
