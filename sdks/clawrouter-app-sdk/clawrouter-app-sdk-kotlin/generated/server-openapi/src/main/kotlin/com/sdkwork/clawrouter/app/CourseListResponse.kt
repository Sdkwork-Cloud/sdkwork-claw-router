package com.sdkwork.clawrouter.app

data class CourseListResponse(
    val content: List<CourseItem>? = null,
    val items: List<CourseItem>? = null,
    val page: Int? = null,
    val size: Int? = null,
    val totalElements: Int? = null
)
