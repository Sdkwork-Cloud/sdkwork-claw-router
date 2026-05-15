package com.sdkwork.clawrouter.backend

data class CommerceBillingExportRecord(
    val approvedBy: String? = null,
    val auditLogId: String? = null,
    val createdAt: String? = null,
    val createdBy: String? = null,
    val downloadCount: String? = null,
    val expireAt: String? = null,
    val exportNo: String? = null,
    val exportType: String? = null,
    val fileHash: String? = null,
    val fileManifest: Map<String, String>? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val periodEnd: String? = null,
    val periodStart: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val statementId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
