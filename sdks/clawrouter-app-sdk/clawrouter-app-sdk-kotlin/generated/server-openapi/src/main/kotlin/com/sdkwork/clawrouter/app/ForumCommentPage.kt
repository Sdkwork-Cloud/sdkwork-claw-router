package com.sdkwork.clawrouter.app

data class ForumCommentPage(
    val content: List<ForumCommentItem>? = null,
    val items: List<ForumCommentItem>? = null,
    val page: Int? = null,
    val size: Int? = null,
    val totalElements: Int? = null
)
