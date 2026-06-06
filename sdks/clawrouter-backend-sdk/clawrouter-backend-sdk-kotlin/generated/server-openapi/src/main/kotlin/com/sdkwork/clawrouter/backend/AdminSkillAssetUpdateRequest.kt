package com.sdkwork.clawrouter.backend

data class AdminSkillAssetUpdateRequest(
    val altText: String? = null,
    val artifactId: String? = null,
    val asset: MediaResource? = null,
    val assetType: Int? = null,
    val durationSeconds: String? = null,
    val fileSize: String? = null,
    val height: Int? = null,
    val mimeType: String? = null,
    val publishedAt: String? = null,
    val sortOrder: Int? = null,
    val status: Int? = null,
    val thumbnail: MediaResource? = null,
    val title: String? = null,
    val width: Int? = null
)
