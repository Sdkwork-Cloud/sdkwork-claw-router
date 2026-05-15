package com.sdkwork.clawrouter.app

data class PlusFavoriteRecord(
    val folderId: String? = null,
    val image: Map<String, String>? = null,
    val lastViewedAt: String? = null,
    val remark: String? = null,
    val tags: String? = null,
    val title: String? = null,
    val userId: String? = null
)
