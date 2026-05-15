package com.sdkwork.clawrouter.backend

data class AdminSkillArtifactItem(
    val artifactRef: String? = null,
    val artifactSizeBytes: Int? = null,
    val artifactType: Int? = null,
    val artifactUrl: String? = null,
    val checksumHash: String? = null,
    val createdAt: String? = null,
    val deprecatedAt: String? = null,
    val frameworks: List<String>? = null,
    val id: String? = null,
    val licenseName: String? = null,
    val osName: String? = null,
    val platformType: String? = null,
    val publishedAt: String? = null,
    val releaseNotes: String? = null,
    val runtime: String? = null,
    val skillId: String? = null,
    val status: Int? = null,
    val targetId: String? = null,
    val targetType: Int? = null,
    val updatedAt: String? = null,
    val version: String? = null
)
