package com.sdkwork.clawrouter.app

data class RoutingChannelTestResponse(
    val channelId: String? = null,
    val item: RoutingChannelItem? = null,
    val latency: String? = null,
    val status: String? = null,
    val success: Boolean? = null
)
