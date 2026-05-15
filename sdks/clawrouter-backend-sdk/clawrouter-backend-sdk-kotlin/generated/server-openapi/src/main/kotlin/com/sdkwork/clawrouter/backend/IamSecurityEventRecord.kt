package com.sdkwork.clawrouter.backend

data class IamSecurityEventRecord(
    val createdAt: String? = null,
    val detailJson: Map<String, String>? = null,
    val eventType: String? = null,
    val id: String? = null,
    val sessionId: String? = null,
    val severity: String? = null,
    val tenantId: String? = null,
    val userId: String? = null
)
