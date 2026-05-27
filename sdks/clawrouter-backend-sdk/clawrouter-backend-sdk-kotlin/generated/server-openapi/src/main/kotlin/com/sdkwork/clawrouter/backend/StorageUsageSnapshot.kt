package com.sdkwork.clawrouter.backend

data class StorageUsageSnapshot(
    val fileCount: Int? = null,
    val id: String? = null,
    val reservedBytes: Int? = null,
    val scope: String? = null,
    val scopeId: String? = null,
    val scopeType: String? = null,
    val snapshotAt: String? = null,
    val snapshotType: String? = null,
    val usedBytes: Int? = null
)
