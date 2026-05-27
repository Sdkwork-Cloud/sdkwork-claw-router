package com.sdkwork.clawrouter.backend

data class AdminCourseDashboard(
    val draftCourses: Int? = null,
    val id: String? = null,
    val publishedCourses: Int? = null,
    val reviewQueue: Int? = null,
    val totalComments: Int? = null,
    val totalCourses: Int? = null,
    val totalEngagement: Int? = null,
    val totalLessons: Int? = null,
    val totalStudents: Int? = null
)
