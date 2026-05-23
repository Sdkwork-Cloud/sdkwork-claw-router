package com.sdkwork.clawrouter.backend

data class AdminCacheNamespacePolicy(
    val consistency: String? = null,
    val enabled: Boolean? = null,
    val failureMode: String? = null,
    val instanceName: String? = null,
    val jitterPercent: Int? = null,
    val namespace: String? = null,
    val scope: String? = null,
    val sensitivity: String? = null,
    val staleWhileRevalidateSeconds: Int? = null,
    val tags: List<String>? = null,
    val ttlSeconds: Int? = null
)
