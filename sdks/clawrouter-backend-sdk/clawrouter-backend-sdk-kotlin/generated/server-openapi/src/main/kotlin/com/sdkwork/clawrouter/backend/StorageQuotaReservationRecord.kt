package com.sdkwork.clawrouter.backend

data class StorageQuotaReservationRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val releasedAt: String? = null,
    val reservationNo: String? = null,
    val reservedBytes: String? = null,
    val scopeId: String? = null,
    val scopeType: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uploadSessionId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
