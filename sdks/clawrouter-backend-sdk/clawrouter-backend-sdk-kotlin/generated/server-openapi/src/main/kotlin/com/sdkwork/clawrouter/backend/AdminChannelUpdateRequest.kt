package com.sdkwork.clawrouter.backend

data class AdminChannelUpdateRequest(
    val accessType: String? = null,
    val baseUrl: String? = null,
    val capabilities: List<String>? = null,
    val id: String? = null,
    val models: List<String>? = null,
    val name: String? = null,
    val protocol: String? = null,
    val retryPolicy: ProviderRetryPolicy? = null,
    val secretRef: String? = null,
    val status: String? = null,
    val timeoutMs: Int? = null,
    val vendor: String? = null,
    val weight: Int? = null
)
