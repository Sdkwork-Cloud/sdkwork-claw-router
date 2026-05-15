package com.sdkwork.clawrouter.backend

data class IntegrationProviderHealthSnapshotRecord(
    val channelId: String? = null,
    val checkType: String? = null,
    val checkedAt: String? = null,
    val createdAt: String? = null,
    val errorCode: String? = null,
    val errorMessageMasked: String? = null,
    val healthStatus: String? = null,
    val httpStatus: Int? = null,
    val id: String? = null,
    val latencyMs: Int? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val providerAccountId: String? = null,
    val providerId: String? = null,
    val quotaSnapshot: Map<String, String>? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
