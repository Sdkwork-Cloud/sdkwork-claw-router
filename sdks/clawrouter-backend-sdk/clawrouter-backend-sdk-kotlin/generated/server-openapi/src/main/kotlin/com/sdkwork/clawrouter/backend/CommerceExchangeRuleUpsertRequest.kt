package com.sdkwork.clawrouter.backend

data class CommerceExchangeRuleUpsertRequest(
    val rate: String? = null,
    val sourceAssetType: String? = null,
    val status: String? = null,
    val targetAssetType: String? = null
)
