package com.sdkwork.clawrouter.backend

data class PromotionBudgetLedgerEntryRecord(
    val applicationId: String? = null,
    val budgetAccountId: String? = null,
    val businessType: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val direction: String? = null,
    val idempotencyKey: String? = null,
    val ledgerNo: String? = null,
    val occurredAt: String? = null,
    val organizationId: String? = null,
    val requestNo: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val tenantId: String? = null
)
