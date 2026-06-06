package com.sdkwork.clawrouter.backend

data class CommerceInventoryStockUpdateRequest(
    val availableQuantity: String? = null,
    val reasonCode: String? = null,
    val reservedQuantity: String? = null,
    val status: String? = null,
    val version: String? = null
)
