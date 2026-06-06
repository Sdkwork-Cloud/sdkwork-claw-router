package com.sdkwork.clawrouter.app

data class ForumFeedItem(
    val author: ForumAuthor? = null,
    val categoryId: String? = null,
    val commentCount: String? = null,
    val content: String? = null,
    val contentType: String? = null,
    val cover: MediaResource? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val isCollected: Boolean? = null,
    val isHot: Boolean? = null,
    val isLiked: Boolean? = null,
    val isRecommended: Boolean? = null,
    val isTop: Boolean? = null,
    val likeCount: String? = null,
    val shareCount: String? = null,
    val summary: String? = null,
    val tags: List<String>? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val viewCount: String? = null
)
