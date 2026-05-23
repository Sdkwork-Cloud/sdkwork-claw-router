package com.sdkwork.clawrouter.backend

data class CommerceProductSkuListResponse(
    val items: List<CommerceProductSkuItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
