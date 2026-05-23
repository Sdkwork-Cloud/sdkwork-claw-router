package com.sdkwork.clawrouter.backend

data class CommerceInventoryStockUpdateRequest(
    val availableQuantity: Int? = null,
    val reasonCode: String? = null,
    val reservedQuantity: Int? = null,
    val status: String? = null,
    val version: Int? = null
)
