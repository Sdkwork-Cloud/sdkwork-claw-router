package com.sdkwork.clawrouter.backend

data class CommercePaymentRuntimeAssemblySummary(
    val failed: Int? = null,
    val failedProviderCodes: List<String>? = null,
    val registered: Int? = null,
    val registeredProviderCodes: List<String>? = null,
    val skipped: Int? = null,
    val skippedProviderCodes: List<String>? = null,
    val total: Int? = null
)
