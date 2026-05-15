package com.sdkwork.clawrouter.app

data class StudioCatalogActionRecord(
    val actionType: String? = null,
    val clientIpHash: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val ratingScore: String? = null,
    val releaseId: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val reviewBody: String? = null,
    val reviewTitle: String? = null,
    val status: String? = null,
    val targetId: String? = null,
    val targetType: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userAgentHash: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
