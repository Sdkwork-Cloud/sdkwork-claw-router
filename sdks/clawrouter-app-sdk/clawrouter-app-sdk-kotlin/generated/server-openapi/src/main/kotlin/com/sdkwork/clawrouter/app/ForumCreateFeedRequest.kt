package com.sdkwork.clawrouter.app

data class ForumCreateFeedRequest(
    val categoryId: Int? = null,
    val content: String? = null,
    val images: List<String>? = null,
    val source: String? = null,
    val sourceUrl: String? = null,
    val tags: List<String>? = null,
    val title: String? = null
)
