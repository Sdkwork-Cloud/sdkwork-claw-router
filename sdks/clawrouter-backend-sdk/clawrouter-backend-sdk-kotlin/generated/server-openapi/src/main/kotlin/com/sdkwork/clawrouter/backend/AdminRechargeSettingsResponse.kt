package com.sdkwork.clawrouter.backend

data class AdminRechargeSettingsResponse(
    val baseCurrencyCode: String? = null,
    val basePointsPerCny: String? = null,
    val currencyToCnyRates: Map<String, String>? = null
)
