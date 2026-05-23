package com.sdkwork.clawrouter.app

data class AppApiKeyItem(
    val copyableKey: String? = null,
    val created: String? = null,
    val expires: String? = null,
    val group: String? = null,
    val groupName: String? = null,
    val id: String? = null,
    val ipLimit: String? = null,
    val maskedKey: String? = null,
    val modalities: List<String>? = null,
    val name: String? = null,
    val quota: String? = null,
    val rate: String? = null,
    val status: String? = null,
    val usedQuota: String? = null
)
