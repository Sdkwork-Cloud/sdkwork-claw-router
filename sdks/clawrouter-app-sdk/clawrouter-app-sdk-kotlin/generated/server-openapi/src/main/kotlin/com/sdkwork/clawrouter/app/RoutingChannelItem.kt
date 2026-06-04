package com.sdkwork.clawrouter.app

data class RoutingChannelItem(
    val accessType: String? = null,
    val apiKey: String? = null,
    val balance: String? = null,
    val baseUrl: String? = null,
    val capabilities: List<String>? = null,
    val circuitBreakerPolicy: RoutingCircuitBreakerPolicy? = null,
    val errors: Int? = null,
    val id: String? = null,
    val isMultimodal: Boolean? = null,
    val latency: String? = null,
    val models: List<String>? = null,
    val name: String? = null,
    val protocol: String? = null,
    val provider: String? = null,
    val providerCode: String? = null,
    val retryPolicy: RoutingRetryPolicy? = null,
    val rpm: Int? = null,
    val status: String? = null,
    val timeoutMs: Int? = null,
    val vendor: String? = null,
    val weight: Int? = null
)
