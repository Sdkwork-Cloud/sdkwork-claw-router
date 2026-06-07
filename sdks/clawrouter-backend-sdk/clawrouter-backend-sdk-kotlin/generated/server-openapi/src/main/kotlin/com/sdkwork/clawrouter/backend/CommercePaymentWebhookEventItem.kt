package com.sdkwork.clawrouter.backend

data class CommercePaymentWebhookEventItem(
    val eventNo: String? = null,
    val eventType: String? = null,
    val externalEventId: String? = null,
    val id: String? = null,
    val processStatus: String? = null,
    val processedAt: String? = null,
    val providerCode: String? = null,
    val receivedAt: String? = null
)
