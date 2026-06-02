package com.sdkwork.clawrouter.app

data class CommerceIdempotencyKeyRecord(
    val createdAt: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val lockedUntil: String? = null,
    val organizationId: String? = null,
    val requestHash: String? = null,
    val responseJson: String? = null,
    val scope: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
