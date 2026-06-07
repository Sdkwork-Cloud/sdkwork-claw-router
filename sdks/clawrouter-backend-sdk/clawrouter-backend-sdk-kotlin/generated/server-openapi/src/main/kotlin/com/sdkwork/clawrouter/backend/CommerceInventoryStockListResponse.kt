package com.sdkwork.clawrouter.backend

data class CommerceInventoryStockListResponse(
    val items: List<CommerceInventoryStockItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
