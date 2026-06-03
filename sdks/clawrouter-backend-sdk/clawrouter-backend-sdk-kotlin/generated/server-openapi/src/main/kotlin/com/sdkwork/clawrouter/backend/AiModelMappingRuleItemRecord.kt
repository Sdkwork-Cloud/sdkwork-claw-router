package com.sdkwork.clawrouter.backend

data class AiModelMappingRuleItemRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val enabled: Boolean? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val ruleId: String? = null,
    val ruleUuid: String? = null,
    val sortOrder: Int? = null,
    val sourceCatalogKey: String? = null,
    val sourceModel: String? = null,
    val status: String? = null,
    val targetCatalogKey: String? = null,
    val targetModel: String? = null,
    val targetProviderModel: String? = null,
    val targetProviderNativeModel: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
