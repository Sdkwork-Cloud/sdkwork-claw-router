package com.sdkwork.clawrouter.backend

data class AdminAppTemplateListResponse(
    val hasNextPage: Boolean? = null,
    val items: List<AdminAppTemplateItemResponse>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
