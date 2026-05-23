package com.sdkwork.clawrouter.backend

data class CommercePaymentProviderItem(
    val capabilities: List<String>? = null,
    val createdAt: String? = null,
    val displayName: String? = null,
    val id: String? = null,
    val providerCode: String? = null,
    val providerType: String? = null,
    val settlementType: String? = null,
    val status: String? = null,
    val supportedCountries: List<String>? = null,
    val supportedCurrencies: List<String>? = null,
    val updatedAt: String? = null
)
