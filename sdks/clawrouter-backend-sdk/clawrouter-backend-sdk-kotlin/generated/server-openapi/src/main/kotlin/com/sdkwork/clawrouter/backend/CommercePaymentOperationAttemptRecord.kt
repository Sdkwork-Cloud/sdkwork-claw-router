package com.sdkwork.clawrouter.backend

data class CommercePaymentOperationAttemptRecord(
    val channelId: String? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val httpStatus: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val nativeRefundId: String? = null,
    val nativeRequestId: String? = null,
    val nativeTradeId: String? = null,
    val operationCode: String? = null,
    val operationNo: String? = null,
    val organizationId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val providerErrorCode: String? = null,
    val providerErrorMessage: String? = null,
    val requestDigest: String? = null,
    val responseDigest: String? = null,
    val retryable: String? = null,
    val sdkworkResourceId: String? = null,
    val sdkworkResourceType: String? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val tenantId: String? = null
)
