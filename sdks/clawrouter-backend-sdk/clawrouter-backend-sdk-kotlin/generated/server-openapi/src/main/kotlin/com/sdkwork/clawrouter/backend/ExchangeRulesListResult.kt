package com.sdkwork.clawrouter.backend

data class ExchangeRulesListResult(
    val code: String? = null,
    val data_: List<CommerceExchangeRuleItem>? = null,
    val message: String? = null,
    val msg: String? = null
)
