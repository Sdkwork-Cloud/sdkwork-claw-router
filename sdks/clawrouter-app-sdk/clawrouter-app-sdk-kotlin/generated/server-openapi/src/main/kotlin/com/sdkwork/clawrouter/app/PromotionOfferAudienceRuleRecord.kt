package com.sdkwork.clawrouter.app

data class PromotionOfferAudienceRuleRecord(
    val createdAt: String? = null,
    val id: String? = null,
    val offerVersionId: String? = null,
    val organizationId: String? = null,
    val priority: Int? = null,
    val ruleOperator: String? = null,
    val ruleType: String? = null,
    val ruleValue: String? = null,
    val ruleValueJson: Map<String, String>? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
