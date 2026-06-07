package com.sdkwork.clawrouter.backend

data class CommercePaymentAttemptListResponse(
    val items: List<CommercePaymentAttemptItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
