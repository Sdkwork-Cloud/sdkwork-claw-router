package com.sdkwork.clawrouter.app

data class AppDetailResponse(
    val category: String? = null,
    val description: String? = null,
    val developer: String? = null,
    val downloads: String? = null,
    val features: List<String>? = null,
    val id: String? = null,
    val image: String? = null,
    val name: String? = null,
    val rating: Double? = null,
    val releases: List<AppReleaseItem>? = null,
    val screenshots: List<String>? = null
)
