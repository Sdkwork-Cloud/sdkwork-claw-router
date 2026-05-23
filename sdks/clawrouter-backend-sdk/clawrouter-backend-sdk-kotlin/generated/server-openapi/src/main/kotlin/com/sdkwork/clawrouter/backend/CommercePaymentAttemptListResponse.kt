package com.sdkwork.clawrouter.backend

data class CommercePaymentAttemptListResponse(
    val items: List<CommercePaymentAttemptItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
