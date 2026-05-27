package com.sdkwork.clawrouter.app

data class GenerationHistoryItem(
    val aspectRatio: String? = null,
    val createdAt: String? = null,
    val date: String? = null,
    val durationSeconds: Int? = null,
    val id: String? = null,
    val images: List<String>? = null,
    val modelCatalogKey: String? = null,
    val modelInfo: String? = null,
    val outputText: String? = null,
    val prompt: String? = null,
    val status: String? = null,
    val type: String? = null,
    val updatedAt: String? = null,
    val url: String? = null,
    val videos: List<GenerationHistoryMediaItem>? = null
)
