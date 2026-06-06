package com.sdkwork.clawrouter.app

data class ForumCreateCommentRequest(
    val content: String? = null,
    val contentId: String? = null,
    val contentType: String? = null,
    val deviceInfo: String? = null
)
