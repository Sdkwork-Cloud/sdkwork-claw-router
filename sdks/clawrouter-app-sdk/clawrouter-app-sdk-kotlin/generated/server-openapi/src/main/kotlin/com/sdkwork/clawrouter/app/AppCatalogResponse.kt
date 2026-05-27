package com.sdkwork.clawrouter.app

data class AppCatalogResponse(
    val hasNextPage: Boolean? = null,
    val items: List<AppCatalogItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
