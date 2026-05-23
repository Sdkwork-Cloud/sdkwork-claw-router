package com.sdkwork.clawrouter.backend

data class AdminCacheSummary(
    val cacheDeletes: Int? = null,
    val cacheErrors: Int? = null,
    val cacheHits: Int? = null,
    val cacheInspections: Int? = null,
    val cacheMisses: Int? = null,
    val cacheRefreshes: Int? = null,
    val cacheWrites: Int? = null,
    val expiredEntries: Int? = null,
    val runtimeTarget: String? = null,
    val totalEntries: Int? = null,
    val totalInstances: Int? = null,
    val totalNamespaces: Int? = null
)
