package com.sdkwork.clawrouter.backend

data class MessagingCollectionResponse(
    val items: List<Map<String, String>>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
