package com.sdkwork.clawrouter.app

data class OpsConfigSnapshotRecord(
    val configHash: String? = null,
    val configPayload: Map<String, String>? = null,
    val configScope: String? = null,
    val configType: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val publishedAt: String? = null,
    val publishedBy: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val rollbackFromSnapshotId: String? = null,
    val snapshotNo: String? = null,
    val sourceIds: Map<String, String>? = null,
    val sourceTable: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
