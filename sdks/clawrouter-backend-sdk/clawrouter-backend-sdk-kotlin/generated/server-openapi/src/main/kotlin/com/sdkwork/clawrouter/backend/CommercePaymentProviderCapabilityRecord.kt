package com.sdkwork.clawrouter.backend

data class CommercePaymentProviderCapabilityRecord(
    val capabilityCode: String? = null,
    val countryCode: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val effectiveFrom: String? = null,
    val effectiveTo: String? = null,
    val id: String? = null,
    val maxAmount: String? = null,
    val metadataJson: Map<String, String>? = null,
    val methodCode: String? = null,
    val minAmount: String? = null,
    val nativeOperationCodes: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val sceneCode: String? = null,
    val status: String? = null,
    val supportedStatementTypes: Map<String, String>? = null,
    val supportedWebhookEvents: Map<String, String>? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
