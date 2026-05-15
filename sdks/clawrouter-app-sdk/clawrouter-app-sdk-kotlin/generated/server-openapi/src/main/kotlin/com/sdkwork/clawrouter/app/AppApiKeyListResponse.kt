package com.sdkwork.clawrouter.app

data class AppApiKeyListResponse(
    val groups: List<AppApiKeyGroup>? = null,
    val items: List<AppApiKeyItem>? = null
)
