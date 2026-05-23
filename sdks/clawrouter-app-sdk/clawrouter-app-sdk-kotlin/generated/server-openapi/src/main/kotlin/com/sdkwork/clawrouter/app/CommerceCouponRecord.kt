package com.sdkwork.clawrouter.app

data class CommerceCouponRecord(
    val claimedAt: String? = null,
    val couponCode: String? = null,
    val createdAt: String? = null,
    val disabledAt: String? = null,
    val expiresAt: String? = null,
    val idempotencyKey: String? = null,
    val issueBatchId: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val redeemedAt: String? = null,
    val requestNo: String? = null,
    val status: String? = null,
    val templateId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
