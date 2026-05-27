package com.sdkwork.clawrouter.app

data class IntegrationServiceProviderFinanceProfileRecord(
    val billingCycle: String? = null,
    val createdAt: String? = null,
    val creditLimitAmount: String? = null,
    val currency: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val invoiceTitleId: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val paymentTermsDays: Int? = null,
    val serviceProviderId: String? = null,
    val settlementDay: Int? = null,
    val settlementMode: String? = null,
    val status: String? = null,
    val suspendThresholdAmount: String? = null,
    val taxProfileRef: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val warningThresholdAmount: String? = null
)
