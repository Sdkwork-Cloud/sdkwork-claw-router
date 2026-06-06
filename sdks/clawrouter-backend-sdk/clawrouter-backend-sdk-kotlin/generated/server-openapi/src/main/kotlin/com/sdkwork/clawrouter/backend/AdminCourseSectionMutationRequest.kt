package com.sdkwork.clawrouter.backend

data class AdminCourseSectionMutationRequest(
    val description: String? = null,
    val metadata: Map<String, String>? = null,
    val sectionNo: String? = null,
    val sortOrder: String? = null,
    val status: String? = null,
    val title: String? = null
)
