package com.sdkwork.clawrouter.app

data class CourseApplicationCreateRequest(
    val category: String? = null,
    val contactEmail: String? = null,
    val contactName: String? = null,
    val description: String? = null,
    val externalBvid: String? = null,
    val notes: String? = null,
    val sourceProvider: String? = null,
    val title: String? = null,
    val video: MediaResource? = null
)
