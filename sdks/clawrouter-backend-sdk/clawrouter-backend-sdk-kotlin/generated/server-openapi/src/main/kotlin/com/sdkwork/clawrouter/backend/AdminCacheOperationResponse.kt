package com.sdkwork.clawrouter.backend

data class AdminCacheOperationResponse(
    val cacheKey: String? = null,
    val deletedEntries: Int? = null,
    val instanceName: String? = null,
    val namespace: String? = null,
    val operation: String? = null,
    val refreshedEntries: Int? = null,
    val status: String? = null
)
