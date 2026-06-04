package com.sdkwork.clawrouter.backend

data class AdminChannelCredentialInput(
    val apiKey: String? = null,
    val baseUrl: String? = null,
    val name: String? = null,
    val priority: Int? = null,
    val secretRef: String? = null,
    val status: String? = null,
    val weight: Int? = null
)
