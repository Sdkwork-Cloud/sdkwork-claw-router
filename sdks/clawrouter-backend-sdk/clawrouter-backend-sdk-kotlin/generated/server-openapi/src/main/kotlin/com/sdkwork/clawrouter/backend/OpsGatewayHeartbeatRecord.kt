package com.sdkwork.clawrouter.backend

data class OpsGatewayHeartbeatRecord(
    val activeConnections: String? = null,
    val cpuPercent: String? = null,
    val createdAt: String? = null,
    val diskPercent: String? = null,
    val heartbeatAt: String? = null,
    val id: String? = null,
    val instanceId: String? = null,
    val legalHold: Boolean? = null,
    val memoryPercent: String? = null,
    val metadata: Map<String, String>? = null,
    val networkInBytes: String? = null,
    val networkOutBytes: String? = null,
    val openFileCount: String? = null,
    val organizationId: String? = null,
    val payload: Map<String, String>? = null,
    val payloadHash: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val threadCount: String? = null,
    val traceId: String? = null,
    val uptimeSeconds: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
