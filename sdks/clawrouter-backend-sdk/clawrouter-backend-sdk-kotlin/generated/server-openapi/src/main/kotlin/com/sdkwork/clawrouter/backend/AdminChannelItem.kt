package com.sdkwork.clawrouter.backend

data class AdminChannelItem(
    val accessType: String? = null,
    val balance: String? = null,
    val baseUrl: String? = null,
    val capabilities: List<String>? = null,
    val errors: Int? = null,
    val id: String? = null,
    val isMultimodal: Boolean? = null,
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
