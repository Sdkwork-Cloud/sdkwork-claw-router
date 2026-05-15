package com.sdkwork.clawrouter.backend

data class AdminAnnouncementUpdateRequest(
    val content: String? = null,
    val status: String? = null,
    val target: String? = null,
    val title: String? = null
)
