package com.sdkwork.clawrouter.backend

data class PromotionOfferAudienceRuleRecord(
    val createdAt: String? = null,
    val offerVersionId: String? = null,
    val organizationId: String? = null,
    val ruleOperator: String? = null,
    val ruleType: String? = null,
    val ruleValue: String? = null,
    val ruleValueJson: Map<String, String>? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
