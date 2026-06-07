package com.sdkwork.clawrouter.backend

data class CommercePaymentWebhookEventListResponse(
    val items: List<CommercePaymentWebhookEventItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
