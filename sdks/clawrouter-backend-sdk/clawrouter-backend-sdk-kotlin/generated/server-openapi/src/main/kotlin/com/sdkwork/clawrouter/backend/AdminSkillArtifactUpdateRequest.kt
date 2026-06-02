package com.sdkwork.clawrouter.backend

data class AdminSkillArtifactUpdateRequest(
    val artifact: MediaResource? = null,
    val artifactRef: String? = null,
    val artifactSizeBytes: Int? = null,
    val artifactType: Int? = null,
    val checksumHash: String? = null,
    val deprecatedAt: String? = null,
    val frameworks: List<String>? = null,
    val licenseName: String? = null,
    val osName: String? = null,
    val platformType: String? = null,
    val publishedAt: String? = null,
    val releaseNotes: String? = null,
    val runtime: String? = null,
    val status: Int? = null,
    val version: String? = null
)
