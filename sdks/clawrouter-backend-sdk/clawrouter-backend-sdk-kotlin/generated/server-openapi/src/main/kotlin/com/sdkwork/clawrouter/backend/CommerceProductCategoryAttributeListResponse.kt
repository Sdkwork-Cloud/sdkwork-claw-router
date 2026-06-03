package com.sdkwork.clawrouter.backend

data class CommerceProductCategoryAttributeListResponse(
    val items: List<CommerceProductCategoryAttributeItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
