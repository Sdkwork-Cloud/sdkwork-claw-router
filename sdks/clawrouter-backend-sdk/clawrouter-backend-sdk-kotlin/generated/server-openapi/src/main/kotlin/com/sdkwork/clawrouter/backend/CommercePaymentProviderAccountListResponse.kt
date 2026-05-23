package com.sdkwork.clawrouter.backend

data class CommercePaymentProviderAccountListResponse(
    val items: List<CommercePaymentProviderAccountItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
