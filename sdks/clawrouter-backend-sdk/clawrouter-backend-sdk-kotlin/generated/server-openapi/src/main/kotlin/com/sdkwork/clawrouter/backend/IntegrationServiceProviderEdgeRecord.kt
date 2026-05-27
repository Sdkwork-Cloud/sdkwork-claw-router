package com.sdkwork.clawrouter.backend

data class IntegrationServiceProviderEdgeRecord(
    val buyerProviderId: String? = null,
    val contractNo: String? = null,
    val contractSnapshot: Map<String, String>? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val edgeNo: String? = null,
    val edgeType: String? = null,
    val effectiveFrom: String? = null,
    val effectiveTo: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val sellerProviderId: String? = null,
    val settlementMode: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
