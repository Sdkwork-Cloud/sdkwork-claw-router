package com.sdkwork.clawrouter.backend

data class PromotionCollectionResponse(
    val items: List<Map<String, Any>>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
