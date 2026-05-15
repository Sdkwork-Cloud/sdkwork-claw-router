package com.sdkwork.clawrouter.app

data class PlusAppRecord(
    val accessUrl: String? = null,
    val appType: String? = null,
    val bundleId: String? = null,
    val description: String? = null,
    val downloadUrl: String? = null,
    val icon: Map<String, String>? = null,
    val iconUrl: String? = null,
    val installConfig: Map<String, String>? = null,
    val installPlatforms: Map<String, String>? = null,
    val installSkill: Map<String, String>? = null,
    val packageName: String? = null,
    val platforms: Map<String, String>? = null,
    val projectId: String? = null,
    val releaseNotes: Map<String, String>? = null,
    val resourceList: Map<String, String>? = null,
    val storeUrl: String? = null,
    val userId: String? = null,
    val version: String? = null
)
