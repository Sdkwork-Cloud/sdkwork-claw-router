package com.sdkwork.clawrouter.backend

data class AdminCacheKeyListResponse(
    val hasMore: Boolean? = null,
    val instanceName: String? = null,
    val items: List<AdminCacheKeyItem>? = null,
    val limit: Int? = null,
    val namespace: String? = null,
    val nextCursor: String? = null,
    val returnedItems: Int? = null,
    val scanComplete: Boolean? = null,
    val scannedItems: Int? = null
)
