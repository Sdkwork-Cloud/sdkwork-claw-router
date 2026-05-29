package com.sdkwork.clawrouter.backend

data class AiModalityRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val description: String? = null,
    val displayName: String? = null,
    val id: String? = null,
    val inputSupported: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val modalityCode: String? = null,
    val modalityGroup: String? = null,
    val organizationId: String? = null,
    val outputSupported: Boolean? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
