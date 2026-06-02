package com.sdkwork.clawrouter.backend

data class CommerceRechargeSettingsUpdateRequest(
    val baseCurrencyCode: String? = null,
    val basePointsPerCny: String? = null,
    val currencyToCnyRates: Map<String, String>? = null
)
