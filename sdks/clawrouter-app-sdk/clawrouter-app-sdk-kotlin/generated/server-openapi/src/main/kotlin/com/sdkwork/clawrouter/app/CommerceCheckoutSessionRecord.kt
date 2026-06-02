package com.sdkwork.clawrouter.app

data class CommerceCheckoutSessionRecord(
    val checkoutSessionNo: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val requestHash: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
