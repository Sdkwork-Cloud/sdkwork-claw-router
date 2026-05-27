package com.sdkwork.clawrouter.backend

data class StorageUsageSnapshotRecord(
    val appId: String? = null,
    val businessDomain: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val scopeId: String? = null,
    val scopeType: String? = null,
    val snapshotType: String? = null,
    val spaceId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
