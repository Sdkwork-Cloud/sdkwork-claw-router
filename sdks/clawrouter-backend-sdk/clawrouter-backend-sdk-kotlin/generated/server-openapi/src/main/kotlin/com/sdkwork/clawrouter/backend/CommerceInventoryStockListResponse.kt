package com.sdkwork.clawrouter.backend

data class CommerceInventoryStockListResponse(
    val items: List<CommerceInventoryStockItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
