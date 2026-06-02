package com.sdkwork.clawrouter.backend

data class CommercePaymentStatementItemRecord(
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val feeAmount: String? = null,
    val grossAmount: String? = null,
    val id: String? = null,
    val metadataJson: Map<String, String>? = null,
    val nativeOrderNo: String? = null,
    val nativeRefundId: String? = null,
    val nativeTradeId: String? = null,
    val netAmount: String? = null,
    val occurredAt: String? = null,
    val organizationId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val providerStatus: String? = null,
    val rawRowDigest: String? = null,
    val rowNo: String? = null,
    val sdkworkOutRefundNo: String? = null,
    val sdkworkOutTradeNo: String? = null,
    val settledAt: String? = null,
    val statementId: String? = null,
    val tenantId: String? = null,
    val transactionType: String? = null
)
