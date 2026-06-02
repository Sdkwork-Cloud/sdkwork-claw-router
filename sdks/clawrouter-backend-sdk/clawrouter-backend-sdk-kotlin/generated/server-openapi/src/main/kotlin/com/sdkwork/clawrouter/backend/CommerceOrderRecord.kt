package com.sdkwork.clawrouter.backend

data class CommerceOrderRecord(
    val cancelledAt: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val expiredAt: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val orderNo: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val paidAt: String? = null,
    val requestNo: String? = null,
    val status: String? = null,
    val subject: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
