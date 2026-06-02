package com.sdkwork.clawrouter.app

data class ContentCourseLessonRecord(
    val content: String? = null,
    val courseId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val description: String? = null,
    val durationSeconds: String? = null,
    val durationText: String? = null,
    val externalBvid: String? = null,
    val freePreview: Boolean? = null,
    val id: String? = null,
    val lessonNo: Int? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val sectionId: String? = null,
    val sortOrder: Int? = null,
    val sourceProvider: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val video: MediaResource? = null
)
