package com.sdkwork.clawrouter.app

data class ForumCommentPage(
    val content: List<ForumCommentItem>? = null,
    val items: List<ForumCommentItem>? = null,
    val page: String? = null,
    val size: String? = null,
    val totalElements: String? = null
)
