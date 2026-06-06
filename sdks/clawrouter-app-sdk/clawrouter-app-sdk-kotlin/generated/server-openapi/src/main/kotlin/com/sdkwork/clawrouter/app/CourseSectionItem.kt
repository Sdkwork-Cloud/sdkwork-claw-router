package com.sdkwork.clawrouter.app

data class CourseSectionItem(
    val description: String? = null,
    val durationSeconds: String? = null,
    val id: String? = null,
    val lessonCount: String? = null,
    val lessons: List<CourseLessonItem>? = null,
    val sectionId: String? = null,
    val sectionNo: String? = null,
    val sortOrder: String? = null,
    val title: String? = null
)
