package com.sdkwork.clawrouter.app

data class CommerceInventoryLedgerRecord(
    val businessType: String? = null,
    val createdAt: String? = null,
    val direction: String? = null,
    val idempotencyKey: String? = null,
    val movementNo: String? = null,
    val organizationId: String? = null,
    val skuId: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val tenantId: String? = null,
    val warehouseId: String? = null
)
