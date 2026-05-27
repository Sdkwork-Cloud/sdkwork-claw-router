package com.sdkwork.clawrouter.backend

data class AdminAppTemplateListResponse(
    val hasNextPage: Boolean? = null,
    val items: List<AdminAppTemplateItemResponse>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
