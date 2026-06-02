package com.sdkwork.clawrouter.app

data class AppReleaseItem(
    val artifact: MediaResource? = null,
    val id: String? = null,
    val os: String? = null,
    val platformType: String? = null,
    val releaseDate: String? = null,
    val size: String? = null,
    val version: String? = null,
    val whatsNew: String? = null
)
