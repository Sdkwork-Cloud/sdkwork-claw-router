package com.sdkwork.clawrouter.app

data class ForumCreateFeedRequest(
    val categoryId: String? = null,
    val content: String? = null,
    val images: List<MediaResource>? = null,
    val source: String? = null,
    val sourceUrl: String? = null,
    val tags: List<String>? = null,
    val title: String? = null
)
