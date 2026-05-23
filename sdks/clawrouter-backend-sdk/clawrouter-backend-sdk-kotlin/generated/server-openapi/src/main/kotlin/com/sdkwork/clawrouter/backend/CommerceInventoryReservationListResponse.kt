package com.sdkwork.clawrouter.backend

data class CommerceInventoryReservationListResponse(
    val items: List<CommerceInventoryReservationItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
