package com.sdkwork.clawrouter.backend

data class CommerceUsageServiceProviderReconciliationItemRecord(
    val createdAt: String? = null,
    val differenceAmount: String? = null,
    val externalAmount: String? = null,
    val id: String? = null,
    val internalAmount: String? = null,
    val legalHold: Boolean? = null,
    val matchStatus: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val providerInvoiceItemId: String? = null,
    val reasonCode: String? = null,
    val requestId: String? = null,
    val resolutionStatus: String? = null,
    val retentionUntil: String? = null,
    val runId: String? = null,
    val statementItemId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val usageEdgeId: String? = null,
    val usageFactId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
