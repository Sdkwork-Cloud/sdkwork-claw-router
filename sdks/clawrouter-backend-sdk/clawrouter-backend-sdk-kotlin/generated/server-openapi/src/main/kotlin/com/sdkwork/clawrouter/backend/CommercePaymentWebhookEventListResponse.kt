package com.sdkwork.clawrouter.backend

data class CommercePaymentWebhookEventListResponse(
    val items: List<CommercePaymentWebhookEventItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
