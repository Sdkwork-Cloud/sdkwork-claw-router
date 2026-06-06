package com.sdkwork.clawrouter.backend

data class AdminCourseDashboard(
    val draftCourses: String? = null,
    val id: String? = null,
    val publishedCourses: String? = null,
    val reviewQueue: String? = null,
    val totalComments: String? = null,
    val totalCourses: String? = null,
    val totalEngagement: String? = null,
    val totalLessons: String? = null,
    val totalStudents: String? = null
)
