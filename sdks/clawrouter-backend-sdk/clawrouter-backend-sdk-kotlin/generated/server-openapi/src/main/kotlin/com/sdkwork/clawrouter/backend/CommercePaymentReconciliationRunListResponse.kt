package com.sdkwork.clawrouter.backend

data class CommercePaymentReconciliationRunListResponse(
    val items: List<CommercePaymentReconciliationRunItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
