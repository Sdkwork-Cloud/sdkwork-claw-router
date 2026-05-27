package com.sdkwork.clawrouter.app

data class IntegrationProviderInvoiceItemRecord(
    val amount: String? = null,
    val billingMeterCode: String? = null,
    val createdAt: String? = null,
    val currency: String? = null,
    val id: String? = null,
    val importId: String? = null,
    val legalHold: Boolean? = null,
    val matchStatus: String? = null,
    val metadata: Map<String, String>? = null,
    val model: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val providerRequestId: String? = null,
    val providerUsageId: String? = null,
    val quantity: String? = null,
    val rawPayloadHash: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
