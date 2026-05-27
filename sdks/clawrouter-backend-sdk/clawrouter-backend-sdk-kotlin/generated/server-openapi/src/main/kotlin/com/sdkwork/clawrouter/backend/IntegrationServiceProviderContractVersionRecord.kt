package com.sdkwork.clawrouter.backend

data class IntegrationServiceProviderContractVersionRecord(
    val approvalStatus: String? = null,
    val approvedAt: String? = null,
    val approvedBy: String? = null,
    val contractId: String? = null,
    val contractPayload: Map<String, String>? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val publishedAt: String? = null,
    val requestedBy: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val versionHash: String? = null,
    val versionNo: Int? = null
)
