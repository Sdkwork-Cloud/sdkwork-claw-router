package com.sdkwork.clawrouter.backend

data class CommercePaymentRuntimeAssemblySummary(
    val failed: String? = null,
    val failedProviderCodes: List<String>? = null,
    val registered: String? = null,
    val registeredProviderCodes: List<String>? = null,
    val skipped: String? = null,
    val skippedProviderCodes: List<String>? = null,
    val total: String? = null
)
