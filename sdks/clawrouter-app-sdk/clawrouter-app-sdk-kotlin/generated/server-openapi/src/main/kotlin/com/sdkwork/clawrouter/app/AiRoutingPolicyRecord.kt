package com.sdkwork.clawrouter.app

data class AiRoutingPolicyRecord(
    val capability: String? = null,
    val costCeiling: String? = null,
    val createdAt: String? = null,
    val currency: String? = null,
    val dataScope: String? = null,
    val defaultProfileId: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val fallbackMode: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val policyCode: String? = null,
    val policyScope: String? = null,
    val sloLatencyMs: Int? = null,
    val sloSuccessRate: String? = null,
    val status: String? = null,
    val subjectId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
