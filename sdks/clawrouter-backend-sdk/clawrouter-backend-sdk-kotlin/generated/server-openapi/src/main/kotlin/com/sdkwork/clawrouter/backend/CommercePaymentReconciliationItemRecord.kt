package com.sdkwork.clawrouter.backend

data class CommercePaymentReconciliationItemRecord(
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val differenceAmount: String? = null,
    val differenceType: String? = null,
    val id: String? = null,
    val internalAmount: String? = null,
    val internalStatus: String? = null,
    val matchStatus: String? = null,
    val organizationId: String? = null,
    val paymentAttemptId: String? = null,
    val providerAmount: String? = null,
    val providerCode: String? = null,
    val providerStatus: String? = null,
    val reconciliationRunId: String? = null,
    val refundAttemptId: String? = null,
    val refundId: String? = null,
    val resolutionNote: String? = null,
    val resolutionStatus: String? = null,
    val resolvedAt: String? = null,
    val resolvedBy: String? = null,
    val statementId: String? = null,
    val statementItemId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
