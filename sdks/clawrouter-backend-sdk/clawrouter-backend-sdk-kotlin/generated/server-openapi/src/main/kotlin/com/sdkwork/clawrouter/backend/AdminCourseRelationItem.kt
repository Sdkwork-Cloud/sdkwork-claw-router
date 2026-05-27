package com.sdkwork.clawrouter.backend

data class AdminCourseRelationItem(
    val courseId: String? = null,
    val id: String? = null,
    val relatedCourseId: String? = null,
    val relationType: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null
)
