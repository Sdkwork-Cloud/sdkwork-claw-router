package com.sdkwork.clawrouter.backend

data class CommerceInventoryLedgerListResponse(
    val items: List<CommerceInventoryLedgerItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
