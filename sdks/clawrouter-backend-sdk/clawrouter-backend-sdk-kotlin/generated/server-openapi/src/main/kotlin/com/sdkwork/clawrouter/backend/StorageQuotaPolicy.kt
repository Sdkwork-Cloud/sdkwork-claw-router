package com.sdkwork.clawrouter.backend

data class StorageQuotaPolicy(
    val createdAt: String? = null,
    val enforcement: String? = null,
    val id: String? = null,
    val limit: Int? = null,
    val quotaLimitBytes: Int? = null,
    val scopeId: String? = null,
    val scopeType: String? = null,
    val singleFileLimitBytes: Int? = null,
    val status: String? = null,
    val updatedAt: String? = null,
    val used: Int? = null,
    val usedBytes: Int? = null
)
