package com.sdkwork.clawrouter.backend

data class CommercePaymentChannelListResponse(
    val items: List<CommercePaymentChannelItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
