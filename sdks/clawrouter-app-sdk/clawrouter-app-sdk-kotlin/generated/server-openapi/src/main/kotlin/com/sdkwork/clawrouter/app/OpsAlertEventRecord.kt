package com.sdkwork.clawrouter.app

data class OpsAlertEventRecord(
    val alertNo: String? = null,
    val alertStatus: String? = null,
    val createdAt: String? = null,
    val firstSeenAt: String? = null,
    val id: String? = null,
    val lastSeenAt: String? = null,
    val legalHold: Boolean? = null,
    val message: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val requestId: String? = null,
    val resolvedAt: String? = null,
    val resolvedBy: String? = null,
    val retentionUntil: String? = null,
    val severity: String? = null,
    val source: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
