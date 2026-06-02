package com.sdkwork.clawrouter.app

data class CommercePaymentCaptureRecord(
    val amount: String? = null,
    val captureNo: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val failedAt: String? = null,
    val failureCode: String? = null,
    val failureMessage: String? = null,
    val finalCapture: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val nativeCaptureId: String? = null,
    val organizationId: String? = null,
    val paymentAttemptId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val requestNo: String? = null,
    val status: String? = null,
    val submittedAt: String? = null,
    val succeededAt: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
