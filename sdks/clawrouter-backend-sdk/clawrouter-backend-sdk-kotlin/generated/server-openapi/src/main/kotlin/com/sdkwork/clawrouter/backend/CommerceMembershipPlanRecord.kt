package com.sdkwork.clawrouter.backend

data class CommerceMembershipPlanRecord(
    val benefitsJson: Map<String, String>? = null,
    val createdAt: String? = null,
    val levelCode: String? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val planNo: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
