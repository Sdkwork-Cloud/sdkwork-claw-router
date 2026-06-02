package com.sdkwork.clawrouter.app

data class CommerceRechargeSettingsResponse(
    val baseCurrencyCode: String? = null,
    val basePointsPerCny: String? = null,
    val currencyToCnyRates: Map<String, String>? = null,
    val previewExamples: Map<String, Map<String, Map<String, Any>>>? = null
)
