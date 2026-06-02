package com.sdkwork.clawrouter.app

data class CommercePaymentProviderRecord(
    val createdAt: String? = null,
    val displayName: String? = null,
    val id: String? = null,
    val organizationId: String? = null,
    val providerCode: String? = null,
    val providerType: String? = null,
    val sortOrder: String? = null,
    val status: String? = null,
    val supportedCountries: Map<String, String>? = null,
    val supportedCurrencies: Map<String, String>? = null,
    val supportedMethods: Map<String, String>? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
