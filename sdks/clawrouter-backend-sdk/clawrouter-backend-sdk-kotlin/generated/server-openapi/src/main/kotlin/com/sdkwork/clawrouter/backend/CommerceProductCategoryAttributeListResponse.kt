package com.sdkwork.clawrouter.backend

data class CommerceProductCategoryAttributeListResponse(
    val items: List<CommerceProductCategoryAttributeItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
