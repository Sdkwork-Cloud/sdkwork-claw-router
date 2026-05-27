package com.sdkwork.clawrouter.backend

data class AdminCourseMutationRequest(
    val category: String? = null,
    val courseCode: String? = null,
    val description: String? = null,
    val instructorSnapshot: Map<String, String>? = null,
    val level: String? = null,
    val metadata: Map<String, String>? = null,
    val status: String? = null,
    val thumbnailUrl: String? = null,
    val title: String? = null
)
