package com.sdkwork.clawrouter.backend

data class CommerceInvoiceProviderAttemptRecord(
    val attemptNo: String? = null,
    val createdAt: String? = null,
    val failedAt: String? = null,
    val failureCode: String? = null,
    val failureMessage: String? = null,
    val invoiceId: String? = null,
    val organizationId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val providerInvoiceId: String? = null,
    val status: String? = null,
    val submittedAt: String? = null,
    val succeededAt: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
