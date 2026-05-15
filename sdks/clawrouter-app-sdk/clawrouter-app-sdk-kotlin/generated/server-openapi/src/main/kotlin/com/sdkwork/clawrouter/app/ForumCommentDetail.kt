package com.sdkwork.clawrouter.app

data class ForumCommentDetail(
    val author: ForumAuthor? = null,
    val commentId: String? = null,
    val content: String? = null,
    val contentId: Int? = null,
    val contentType: String? = null,
    val createdAt: String? = null,
    val deviceInfo: String? = null,
    val ipAddress: String? = null,
    val isTop: Boolean? = null,
    val likes: Int? = null,
    val parentId: Int? = null,
    val replies: List<ForumCommentItem>? = null,
    val replyCount: Int? = null,
    val status: String? = null,
    val updatedAt: String? = null,
    val userId: Int? = null
)
