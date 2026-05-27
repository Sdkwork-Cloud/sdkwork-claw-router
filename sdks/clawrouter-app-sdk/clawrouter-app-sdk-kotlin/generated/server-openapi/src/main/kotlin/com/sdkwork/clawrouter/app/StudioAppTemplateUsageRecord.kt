package com.sdkwork.clawrouter.app

data class StudioAppTemplateUsageRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val inputSnapshot: Map<String, String>? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val outputSnapshot: Map<String, String>? = null,
    val requestId: String? = null,
    val status: String? = null,
    val targetAppId: String? = null,
    val templateId: String? = null,
    val templateVersionId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val usageType: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
