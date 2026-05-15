package com.sdkwork.clawrouter.backend

data class AdminSkillAssetCreateRequest(
    val altText: String? = null,
    val artifactId: String? = null,
    val assetType: Int? = null,
    val assetUrl: String? = null,
    val durationSeconds: String? = null,
    val fileSize: Int? = null,
    val height: Int? = null,
    val mimeType: String? = null,
    val publishedAt: String? = null,
    val sortOrder: Int? = null,
    val status: Int? = null,
    val thumbnailUrl: String? = null,
    val title: String? = null,
    val width: Int? = null
)
