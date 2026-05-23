package com.sdkwork.clawrouter.backend

data class CommerceProductSpuListResponse(
    val items: List<CommerceProductSpuItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
