package com.sdkwork.clawrouter.backend

data class CommerceUsageServiceProviderReconciliationRunRecord(
    val createdAt: String? = null,
    val differenceAmount: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val matchedCount: String? = null,
    val metadata: Map<String, String>? = null,
    val mismatchCount: String? = null,
    val missingExternalCount: String? = null,
    val missingInternalCount: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val periodEnd: String? = null,
    val periodStart: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val runNo: String? = null,
    val scopeId: String? = null,
    val scopeType: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val totalExternalAmount: String? = null,
    val totalInternalAmount: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
