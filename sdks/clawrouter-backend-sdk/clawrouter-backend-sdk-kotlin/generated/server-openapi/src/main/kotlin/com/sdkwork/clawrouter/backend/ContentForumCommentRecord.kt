package com.sdkwork.clawrouter.backend

data class ContentForumCommentRecord(
    val authorId: String? = null,
    val authorSnapshot: Map<String, String>? = null,
    val body: String? = null,
    val courseId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val likeCount: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val parentId: String? = null,
    val postId: String? = null,
    val rootId: String? = null,
    val status: String? = null,
    val targetId: String? = null,
    val targetType: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
