package com.sdkwork.clawrouter.backend

data class CommercePaymentStatementRecord(
    val createdAt: String? = null,
    val downloadStatus: String? = null,
    val downloadedAt: String? = null,
    val feeAmount: String? = null,
    val fileDigest: String? = null,
    val fileRef: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val netAmount: String? = null,
    val organizationId: String? = null,
    val parseStatus: String? = null,
    val parsedAt: String? = null,
    val periodEnd: String? = null,
    val periodStart: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val providerStatementId: String? = null,
    val requestNo: String? = null,
    val rowCount: String? = null,
    val settlementCurrency: String? = null,
    val statementNo: String? = null,
    val statementType: String? = null,
    val tenantId: String? = null,
    val totalAmount: String? = null,
    val updatedAt: String? = null
)
