package com.sdkwork.clawrouter.app

data class AiUsageServiceProviderChainRecord(
    val chainDepth: Int? = null,
    val chainHash: String? = null,
    val chainPathSnapshot: Map<String, String>? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val leafProviderId: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val occurredAt: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val requestId: String? = null,
    val resolvedSubjectId: String? = null,
    val resolvedSubjectType: String? = null,
    val retentionUntil: String? = null,
    val rootProviderId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val usageFactId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
