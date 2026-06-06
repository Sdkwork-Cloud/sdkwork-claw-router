package com.sdkwork.clawrouter.app

data class CourseApplicationVideoUploadResponse(
    val contentType: String? = null,
    val fileName: String? = null,
    val sha256: String? = null,
    val sizeBytes: String? = null,
    val uploadedAt: String? = null,
    val video: MediaResource? = null
)
