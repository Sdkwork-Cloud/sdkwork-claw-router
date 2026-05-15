package com.sdkwork.clawrouter.app

data class AiRoutingRuleRecord(
    val candidateChannels: Map<String, String>? = null,
    val constraints: Map<String, String>? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val effectiveFrom: String? = null,
    val effectiveTo: String? = null,
    val fallbackChain: Map<String, String>? = null,
    val id: String? = null,
    val matchExpression: Map<String, String>? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val priority: Int? = null,
    val profileId: String? = null,
    val rateLimitPolicyId: String? = null,
    val ruleCode: String? = null,
    val status: String? = null,
    val targetModel: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
