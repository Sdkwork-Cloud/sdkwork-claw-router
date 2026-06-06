package com.sdkwork.clawrouter.app

data class CourseItem(
    val category: String? = null,
    val categoryLabel: String? = null,
    val commentCount: String? = null,
    val content: String? = null,
    val contentId: String? = null,
    val courseCode: String? = null,
    val currency: String? = null,
    val description: String? = null,
    val durationText: String? = null,
    val engagement: CourseEngagement? = null,
    val externalBvid: String? = null,
    val id: String? = null,
    val instructor: CourseInstructor? = null,
    val isCollection: Boolean? = null,
    val lessonsCount: String? = null,
    val level: String? = null,
    val levelLabel: String? = null,
    val priceAmount: String? = null,
    val publishedAt: String? = null,
    val ratingScore: Double? = null,
    val studentsCount: String? = null,
    val tags: List<String>? = null,
    val thumbnail: MediaResource? = null,
    val title: String? = null
)
