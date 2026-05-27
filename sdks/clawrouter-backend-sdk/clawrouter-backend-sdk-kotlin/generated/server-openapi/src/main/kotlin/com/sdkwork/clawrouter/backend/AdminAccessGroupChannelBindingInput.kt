package com.sdkwork.clawrouter.backend

data class AdminAccessGroupChannelBindingInput(
    val capabilities: List<String>? = null,
    val channelId: String? = null,
    val modelScope: List<String>? = null,
    val priority: Int? = null,
    val status: String? = null,
    val weight: Int? = null
)
