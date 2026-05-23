package com.sdkwork.clawrouter.backend

data class AdminCacheInstance(
    val cacheDeletes: Int? = null,
    val cacheErrors: Int? = null,
    val cacheHits: Int? = null,
    val cacheInspections: Int? = null,
    val cacheMisses: Int? = null,
    val cacheRefreshes: Int? = null,
    val cacheWrites: Int? = null,
    val connectionProfileName: String? = null,
    val defaultTtlSeconds: Int? = null,
    val entryCount: Int? = null,
    val expiredEntryCount: Int? = null,
    val keyPrefix: String? = null,
    val maxEntries: Int? = null,
    val name: String? = null,
    val providerKind: String? = null,
    val purpose: String? = null,
    val status: String? = null,
    val supportsDelete: Boolean? = null,
    val supportsInspect: Boolean? = null,
    val supportsRefresh: Boolean? = null
)
