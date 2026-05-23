package com.sdkwork.clawrouter.backend

data class CommerceRefundAttemptRecord(
    val amount: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val failedAt: String? = null,
    val failureCode: String? = null,
    val failureMessage: String? = null,
    val organizationId: String? = null,
    val outRefundNo: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val providerRefundId: String? = null,
    val refundAttemptNo: String? = null,
    val refundId: String? = null,
    val status: String? = null,
    val submittedAt: String? = null,
    val succeededAt: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
