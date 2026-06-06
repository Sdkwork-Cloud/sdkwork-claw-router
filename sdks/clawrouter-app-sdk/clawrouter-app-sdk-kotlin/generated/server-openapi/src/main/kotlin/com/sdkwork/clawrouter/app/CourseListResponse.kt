package com.sdkwork.clawrouter.app

data class CourseListResponse(
    val content: List<CourseItem>? = null,
    val items: List<CourseItem>? = null,
    val page: String? = null,
    val size: String? = null,
    val totalElements: String? = null
)
