package com.sdkwork.clawrouter.backend

data class OpenPlatformPayBindingCreateRequest(
    val mode: String? = null,
    val paymentAccountId: String? = null,
    val paymentChannelId: String? = null,
    val scene: String? = null
)
