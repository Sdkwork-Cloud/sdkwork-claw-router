package com.sdkwork.clawrouter.backend

data class CommerceInvoiceEventRecord(
    val actorId: String? = null,
    val actorType: String? = null,
    val createdAt: String? = null,
    val eventNo: String? = null,
    val eventType: String? = null,
    val fromStatus: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val invoiceId: String? = null,
    val message: String? = null,
    val organizationId: String? = null,
    val payloadJson: Map<String, String>? = null,
    val reasonCode: String? = null,
    val requestId: String? = null,
    val tenantId: String? = null,
    val toStatus: String? = null
)
