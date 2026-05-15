package com.sdkwork.clawrouter.app

data class ForumCreateCommentRequest(
    val content: String? = null,
    val contentId: Int? = null,
    val contentType: String? = null,
    val deviceInfo: String? = null
)
