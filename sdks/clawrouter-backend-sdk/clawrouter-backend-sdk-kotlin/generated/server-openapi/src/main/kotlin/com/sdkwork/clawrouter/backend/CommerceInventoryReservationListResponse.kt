package com.sdkwork.clawrouter.backend

data class CommerceInventoryReservationListResponse(
    val items: List<CommerceInventoryReservationItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
