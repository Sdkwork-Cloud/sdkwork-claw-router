package com.sdkwork.clawrouter.app

data class CommerceOrderCancellationRecord(
    val approvedBy: String? = null,
    val cancellationNo: String? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val idempotencyKey: String? = null,
    val orderId: String? = null,
    val organizationId: String? = null,
    val reasonCode: String? = null,
    val reasonMessage: String? = null,
    val requestedBy: String? = null,
    val status: String? = null,
    val tenantId: String? = null
)
