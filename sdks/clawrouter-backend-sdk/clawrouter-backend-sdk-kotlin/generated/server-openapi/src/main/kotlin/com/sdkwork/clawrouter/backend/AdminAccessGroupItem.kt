package com.sdkwork.clawrouter.backend

data class AdminAccessGroupItem(
    val accountCount: AdminCountPair? = null,
    val billingType: String? = null,
    val capacity: AdminCapacityPair? = null,
    val id: String? = null,
    val name: String? = null,
    val platform: String? = null,
    val rateMultiplier: Double? = null,
    val status: String? = null,
    val type: String? = null,
    val usage: AdminUsagePair? = null
)
