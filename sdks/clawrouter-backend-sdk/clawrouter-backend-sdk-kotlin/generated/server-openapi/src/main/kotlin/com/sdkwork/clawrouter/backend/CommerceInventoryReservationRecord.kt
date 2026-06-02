package com.sdkwork.clawrouter.backend

data class CommerceInventoryReservationRecord(
    val checkoutSessionId: String? = null,
    val createdAt: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val orderId: String? = null,
    val organizationId: String? = null,
    val quantity: String? = null,
    val reservationNo: String? = null,
    val skuId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val warehouseId: String? = null
)
