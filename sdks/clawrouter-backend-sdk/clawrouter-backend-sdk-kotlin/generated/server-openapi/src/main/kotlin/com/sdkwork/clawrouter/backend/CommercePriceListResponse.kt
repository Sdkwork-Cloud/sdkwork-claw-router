package com.sdkwork.clawrouter.backend

data class CommercePriceListResponse(
    val items: List<CommercePriceListItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
