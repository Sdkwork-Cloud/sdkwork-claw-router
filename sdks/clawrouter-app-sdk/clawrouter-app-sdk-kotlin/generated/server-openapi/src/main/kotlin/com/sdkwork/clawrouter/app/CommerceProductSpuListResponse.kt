package com.sdkwork.clawrouter.app

data class CommerceProductSpuListResponse(
    val items: List<CommerceProductSpuItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
