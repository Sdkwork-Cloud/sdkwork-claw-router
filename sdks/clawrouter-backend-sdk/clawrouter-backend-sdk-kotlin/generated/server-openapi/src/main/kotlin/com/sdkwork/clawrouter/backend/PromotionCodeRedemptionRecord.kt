package com.sdkwork.clawrouter.backend

data class PromotionCodeRedemptionRecord(
    val codeId: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val failureCode: String? = null,
    val failureMessage: String? = null,
    val id: String? = null,
    val idempotencyKey: String? = null,
    val occurredAt: String? = null,
    val offerId: String? = null,
    val offerVersionId: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val redemptionChannel: String? = null,
    val redemptionNo: String? = null,
    val redemptionScene: String? = null,
    val requestNo: String? = null,
    val resultStatus: String? = null,
    val stockId: String? = null,
    val subjectId: String? = null,
    val subjectType: String? = null,
    val submittedCodeHash: String? = null,
    val submittedCodeSuffix: String? = null,
    val tenantId: String? = null,
    val userCouponId: String? = null
)
