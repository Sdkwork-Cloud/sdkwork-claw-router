package com.sdkwork.clawrouter.app

data class CourseApplicationCreateResponse(
    val applicationId: Int? = null,
    val category: String? = null,
    val contactEmail: String? = null,
    val contactName: String? = null,
    val description: String? = null,
    val externalBvid: String? = null,
    val id: String? = null,
    val sourceProvider: String? = null,
    val status: String? = null,
    val submittedAt: String? = null,
    val title: String? = null,
    val video: MediaResource? = null
)
