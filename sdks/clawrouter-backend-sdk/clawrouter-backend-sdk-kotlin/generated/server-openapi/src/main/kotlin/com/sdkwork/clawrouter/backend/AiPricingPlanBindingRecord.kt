package com.sdkwork.clawrouter.backend

data class AiPricingPlanBindingRecord(
    val bindingSource: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val effectiveFrom: String? = null,
    val effectiveTo: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val multiplierOverride: String? = null,
    val organizationId: String? = null,
    val pricingPlanCode: String? = null,
    val pricingPlanId: String? = null,
    val priority: Int? = null,
    val quotaPolicyId: String? = null,
    val rpmOverride: String? = null,
    val status: String? = null,
    val subjectCode: String? = null,
    val subjectId: String? = null,
    val subjectType: String? = null,
    val tenantId: String? = null,
    val tpmOverride: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
