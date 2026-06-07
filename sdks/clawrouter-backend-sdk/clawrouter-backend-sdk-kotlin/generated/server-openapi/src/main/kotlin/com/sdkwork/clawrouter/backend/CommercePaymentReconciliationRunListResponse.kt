package com.sdkwork.clawrouter.backend

data class CommercePaymentReconciliationRunListResponse(
    val items: List<CommercePaymentReconciliationRunItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
