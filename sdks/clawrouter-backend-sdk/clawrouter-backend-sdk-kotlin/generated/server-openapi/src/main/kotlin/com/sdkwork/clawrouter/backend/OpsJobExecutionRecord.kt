package com.sdkwork.clawrouter.backend

data class OpsJobExecutionRecord(
    val createdAt: String? = null,
    val durationMs: String? = null,
    val endedAt: String? = null,
    val executionStatus: String? = null,
    val failureCount: String? = null,
    val failureReason: String? = null,
    val id: String? = null,
    val jobName: String? = null,
    val jobType: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payload: Map<String, String>? = null,
    val payloadHash: String? = null,
    val processedCount: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val successCount: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val triggerType: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
