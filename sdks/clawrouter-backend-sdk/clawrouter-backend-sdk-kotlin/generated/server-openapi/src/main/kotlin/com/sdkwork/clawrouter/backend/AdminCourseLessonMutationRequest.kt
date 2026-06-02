package com.sdkwork.clawrouter.backend

data class AdminCourseLessonMutationRequest(
    val description: String? = null,
    val durationSeconds: Int? = null,
    val externalBvid: String? = null,
    val freePreview: Boolean? = null,
    val lessonNo: String? = null,
    val metadata: Map<String, String>? = null,
    val sectionId: String? = null,
    val status: String? = null,
    val title: String? = null,
    val video: MediaResource? = null
)
