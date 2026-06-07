package com.sdkwork.clawrouter.backend

data class CommercePaymentChannelListResponse(
    val items: List<CommercePaymentChannelItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
