package com.sdkwork.clawrouter.backend

data class IntegrationServiceProviderPriceChangeRequestRecord(
    val afterHash: String? = null,
    val approvalStatus: String? = null,
    val approvedBy: String? = null,
    val beforeHash: String? = null,
    val buyerProviderId: String? = null,
    val changeNo: String? = null,
    val changeType: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val draftPayload: Map<String, String>? = null,
    val effectiveFrom: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val publishedAt: String? = null,
    val requestedBy: String? = null,
    val sellerProviderId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
