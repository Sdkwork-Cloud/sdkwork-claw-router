package com.sdkwork.clawrouter.backend

data class IamVerificationChallengeRecord(
    val consumedAt: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val deliveryRequestId: String? = null,
    val id: String? = null,
    val lockedUntil: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val saltRef: String? = null,
    val status: String? = null,
    val targetMasked: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val verifiedAt: String? = null,
    val version: String? = null
)
