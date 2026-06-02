package com.sdkwork.clawrouter.backend

data class UploadPartRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val partEtag: String? = null,
    val partNumber: Int? = null,
    val partSha256: String? = null,
    val presignedUrlExpiresAt: String? = null,
    val sizeBytes: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uploadSessionId: String? = null,
    val uploadedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
