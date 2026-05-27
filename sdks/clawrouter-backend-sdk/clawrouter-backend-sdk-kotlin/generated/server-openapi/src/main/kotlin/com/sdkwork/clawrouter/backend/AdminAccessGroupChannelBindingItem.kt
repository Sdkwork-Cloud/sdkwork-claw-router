package com.sdkwork.clawrouter.backend

data class AdminAccessGroupChannelBindingItem(
    val capabilities: List<String>? = null,
    val channelCode: String? = null,
    val channelId: String? = null,
    val channelName: String? = null,
    val groupId: String? = null,
    val healthStatus: String? = null,
    val id: String? = null,
    val modelScope: List<String>? = null,
    val models: List<String>? = null,
    val priority: Int? = null,
    val providerCode: String? = null,
    val providerName: String? = null,
    val status: String? = null,
    val weight: Int? = null
)
