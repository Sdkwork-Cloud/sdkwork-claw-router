package com.sdkwork.clawrouter.backend

data class CommerceProductAttributeListResponse(
    val items: List<CommerceProductAttributeItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
