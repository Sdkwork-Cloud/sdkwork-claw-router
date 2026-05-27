package com.sdkwork.clawrouter.backend

data class AdminAppListResponse(
    val hasNextPage: Boolean? = null,
    val items: List<AdminAppItemResponse>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
