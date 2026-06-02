package com.sdkwork.clawrouter.backend

data class CommercePaymentDisputeEventRecord(
    val actorId: String? = null,
    val actorType: String? = null,
    val createdAt: String? = null,
    val disputeId: String? = null,
    val eventNo: String? = null,
    val eventType: String? = null,
    val fromStatus: String? = null,
    val id: String? = null,
    val organizationId: String? = null,
    val payloadJson: Map<String, String>? = null,
    val tenantId: String? = null,
    val toStatus: String? = null
)
