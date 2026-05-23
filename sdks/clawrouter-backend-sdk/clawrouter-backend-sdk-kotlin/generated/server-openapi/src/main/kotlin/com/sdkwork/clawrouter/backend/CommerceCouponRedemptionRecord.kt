package com.sdkwork.clawrouter.backend

data class CommerceCouponRedemptionRecord(
    val couponId: String? = null,
    val createdAt: String? = null,
    val discountAmount: String? = null,
    val idempotencyKey: String? = null,
    val orderId: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val redeemedAt: String? = null,
    val requestNo: String? = null,
    val rolledBackAt: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
