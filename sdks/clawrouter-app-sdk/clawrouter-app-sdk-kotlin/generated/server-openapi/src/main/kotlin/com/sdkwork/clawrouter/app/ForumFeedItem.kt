package com.sdkwork.clawrouter.app

data class ForumFeedItem(
    val author: ForumAuthor? = null,
    val categoryId: Int? = null,
    val commentCount: Int? = null,
    val content: String? = null,
    val contentType: String? = null,
    val coverImage: String? = null,
    val createdAt: String? = null,
    val id: Int? = null,
    val isCollected: Boolean? = null,
    val isHot: Boolean? = null,
    val isLiked: Boolean? = null,
    val isRecommended: Boolean? = null,
    val isTop: Boolean? = null,
    val likeCount: Int? = null,
    val shareCount: Int? = null,
    val summary: String? = null,
    val tags: List<String>? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val viewCount: Int? = null
)
