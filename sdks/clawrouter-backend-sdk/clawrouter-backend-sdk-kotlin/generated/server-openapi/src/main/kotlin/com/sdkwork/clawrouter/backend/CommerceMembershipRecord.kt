package com.sdkwork.clawrouter.backend

data class CommerceMembershipRecord(
    val autoRenew: Boolean? = null,
    val createdAt: String? = null,
    val expiresAt: String? = null,
    val graceUntil: String? = null,
    val id: String? = null,
    val membershipNo: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val planId: String? = null,
    val sourceOrderId: String? = null,
    val sourcePaymentIntentId: String? = null,
    val startsAt: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
