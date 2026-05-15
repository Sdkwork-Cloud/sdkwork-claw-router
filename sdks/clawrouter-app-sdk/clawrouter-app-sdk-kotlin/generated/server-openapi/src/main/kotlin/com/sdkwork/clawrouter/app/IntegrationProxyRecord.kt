package com.sdkwork.clawrouter.app

data class IntegrationProxyRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val description: String? = null,
    val endpoint: String? = null,
    val healthStatus: String? = null,
    val id: String? = null,
    val lastCheckedAt: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val proxyCode: String? = null,
    val proxyType: String? = null,
    val region: String? = null,
    val secretHash: String? = null,
    val secretRef: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
