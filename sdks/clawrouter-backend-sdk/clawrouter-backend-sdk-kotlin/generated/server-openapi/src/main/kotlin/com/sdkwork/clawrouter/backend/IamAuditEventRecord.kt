package com.sdkwork.clawrouter.backend

data class IamAuditEventRecord(
    val action: String? = null,
    val actorUserId: String? = null,
    val appId: String? = null,
    val createdAt: String? = null,
    val detailJson: Map<String, String>? = null,
    val environment: String? = null,
    val id: String? = null,
    val organizationId: String? = null,
    val requestId: String? = null,
    val resourceId: String? = null,
    val resourceType: String? = null,
    val shardingKey: String? = null,
    val tenantId: String? = null
)
