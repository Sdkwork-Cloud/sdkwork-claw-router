package com.sdkwork.clawrouter.backend

data class PlusCommentsRecord(
    val author: Map<String, String>? = null,
    val content: String? = null,
    val contentId: String? = null,
    val contentType: Int? = null,
    val createdAt: String? = null,
    val dataScope: Int? = null,
    val deviceInfo: String? = null,
    val id: String? = null,
    val ipAddress: String? = null,
    val isTop: Boolean? = null,
    val likes: Int? = null,
    val organizationId: String? = null,
    val parentId: String? = null,
    val path: String? = null,
    val replyCount: Int? = null,
    val sortWeight: Int? = null,
    val status: Int? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val v: String? = null
)
