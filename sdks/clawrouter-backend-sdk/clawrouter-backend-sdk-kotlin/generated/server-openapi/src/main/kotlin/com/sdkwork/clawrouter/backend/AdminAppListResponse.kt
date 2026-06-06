package com.sdkwork.clawrouter.backend

data class AdminAppListResponse(
    val hasNextPage: Boolean? = null,
    val items: List<AdminAppItemResponse>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
