package com.sdkwork.clawrouter.backend

data class CommerceProductCategoryListResponse(
    val items: List<CommerceProductCategoryItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
