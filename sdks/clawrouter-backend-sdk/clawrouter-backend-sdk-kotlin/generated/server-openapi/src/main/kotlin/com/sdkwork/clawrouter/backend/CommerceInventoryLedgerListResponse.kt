package com.sdkwork.clawrouter.backend

data class CommerceInventoryLedgerListResponse(
    val items: List<CommerceInventoryLedgerItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
