package com.sdkwork.clawrouter.app

data class CourseSectionItem(
    val description: String? = null,
    val durationSeconds: Int? = null,
    val id: String? = null,
    val lessonCount: Int? = null,
    val lessons: List<CourseLessonItem>? = null,
    val sectionId: Int? = null,
    val sectionNo: Int? = null,
    val sortOrder: Int? = null,
    val title: String? = null
)
