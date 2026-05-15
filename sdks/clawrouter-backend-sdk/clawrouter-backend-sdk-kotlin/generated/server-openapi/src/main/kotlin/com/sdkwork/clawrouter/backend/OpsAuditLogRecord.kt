package com.sdkwork.clawrouter.backend

data class OpsAuditLogRecord(
    val action: String? = null,
    val afterHash: String? = null,
    val approvalId: String? = null,
    val beforeHash: String? = null,
    val changeSummary: Map<String, String>? = null,
    val clientIpHash: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val operatorId: String? = null,
    val operatorNameSnapshot: String? = null,
    val operatorType: String? = null,
    val organizationId: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val riskLevel: String? = null,
    val targetId: String? = null,
    val targetType: String? = null,
    val targetUuid: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userAgentHash: String? = null,
    val uuid: String? = null
)
