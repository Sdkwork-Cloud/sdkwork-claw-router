package com.sdkwork.clawrouter.app

data class ProviderRetryPolicy(
    val backoffMs: Int? = null,
    val maxAttempts: Int? = null,
    val retryableStatusCodes: List<Int>? = null
)
