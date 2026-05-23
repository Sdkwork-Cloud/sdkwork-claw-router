package com.sdkwork.clawrouter.backend

data class CommercePaymentReconciliationRunRecord(
    val completedAt: String? = null,
    val createdAt: String? = null,
    val differenceAmount: String? = null,
    val idempotencyKey: String? = null,
    val matchedCount: String? = null,
    val mismatchedCount: String? = null,
    val missingInternalCount: String? = null,
    val missingProviderCount: String? = null,
    val organizationId: String? = null,
    val periodEnd: String? = null,
    val periodStart: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val reportFileRef: String? = null,
    val requestNo: String? = null,
    val runNo: String? = null,
    val settlementCurrency: String? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val totalInternalAmount: String? = null,
    val totalProviderAmount: String? = null,
    val updatedAt: String? = null
)
