package com.sdkwork.clawrouter.backend

data class ContentCourseSectionRecord(
    val courseId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val description: String? = null,
    val durationSeconds: String? = null,
    val id: String? = null,
    val lessonCount: Int? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val sectionNo: Int? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
