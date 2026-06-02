package com.sdkwork.clawrouter.backend

data class CommerceInventoryLedgerRecord(
    val balanceAfter: String? = null,
    val businessType: String? = null,
    val createdAt: String? = null,
    val direction: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val movementNo: String? = null,
    val organizationId: String? = null,
    val quantity: String? = null,
    val skuId: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val tenantId: String? = null,
    val warehouseId: String? = null
)
