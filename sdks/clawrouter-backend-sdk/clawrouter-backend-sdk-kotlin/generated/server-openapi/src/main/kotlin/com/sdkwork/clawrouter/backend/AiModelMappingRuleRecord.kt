package com.sdkwork.clawrouter.backend

data class AiModelMappingRuleRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val enabled: Boolean? = null,
    val id: String? = null,
    val mappingMode: String? = null,
    val matchType: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val sourceVendorCode: String? = null,
    val sourceVendorId: String? = null,
    val status: String? = null,
    val targetVendorCode: String? = null,
    val targetVendorId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
