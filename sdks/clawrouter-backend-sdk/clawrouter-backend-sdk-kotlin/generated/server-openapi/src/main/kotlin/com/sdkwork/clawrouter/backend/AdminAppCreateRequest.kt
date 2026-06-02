package com.sdkwork.clawrouter.backend

data class AdminAppCreateRequest(
    val accessUrl: String? = null,
    val appType: String? = null,
    val artifact: MediaResource? = null,
    val bundleId: String? = null,
    val config: AdminAppConfig? = null,
    val description: String? = null,
    val icon: MediaResource? = null,
    val installConfig: Map<String, String>? = null,
    val installPlatforms: Map<String, String>? = null,
    val installSkill: Map<String, String>? = null,
    val marketStatus: String? = null,
    val name: String? = null,
    val packageName: String? = null,
    val platforms: Map<String, String>? = null,
    val projectId: String? = null,
    val releaseNotes: List<Map<String, String>>? = null,
    val resourceList: Map<String, String>? = null,
    val status: String? = null,
    val storeUrl: String? = null,
    val userId: String? = null,
    val version: String? = null
)
