package com.sdkwork.clawrouter.backend

data class AiGenerationAssetActionRecord(
    val actionParams: Map<String, String>? = null,
    val actionType: String? = null,
    val assetId: String? = null,
    val clientIpHash: String? = null,
    val clientIpRegion: String? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val failureCode: String? = null,
    val id: String? = null,
    val jobId: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val requestId: String? = null,
    val resultAssetId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userAgentHash: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
