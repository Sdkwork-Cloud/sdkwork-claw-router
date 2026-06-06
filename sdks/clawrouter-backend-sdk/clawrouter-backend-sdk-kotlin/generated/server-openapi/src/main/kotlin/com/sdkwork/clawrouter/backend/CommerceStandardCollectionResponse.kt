package com.sdkwork.clawrouter.backend

data class CommerceStandardCollectionResponse(
    val items: List<Map<String, Any>>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
