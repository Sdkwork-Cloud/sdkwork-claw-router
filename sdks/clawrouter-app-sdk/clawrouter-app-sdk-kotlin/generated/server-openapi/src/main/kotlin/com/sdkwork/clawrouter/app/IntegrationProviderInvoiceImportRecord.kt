package com.sdkwork.clawrouter.app

data class IntegrationProviderInvoiceImportRecord(
    val createdAt: String? = null,
    val currency: String? = null,
    val id: String? = null,
    val importNo: String? = null,
    val importStatus: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val periodEnd: String? = null,
    val periodStart: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val sourceFileRef: String? = null,
    val sourceHash: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val totalAmount: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
