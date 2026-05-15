package com.sdkwork.clawrouter.app

data class UpdateRoutingChannelRequest(
    val accessType: String? = null,
    val baseUrl: String? = null,
    val capabilities: List<String>? = null,
    val models: List<String>? = null,
    val name: String? = null,
    val protocol: String? = null,
    val secretRef: String? = null,
    val status: String? = null,
    val vendor: String? = null,
    val weight: Int? = null
)
