package com.sdkwork.clawrouter.app

data class AiConfigChangeEventRecord(
    val changedObjectId: String? = null,
    val changedObjectType: String? = null,
    val configScope: String? = null,
    val configVersion: String? = null,
    val createdAt: String? = null,
    val eventPayload: Map<String, String>? = null,
    val eventStatus: String? = null,
    val id: String? = null,
    val lastErrorMessage: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val publishAttempts: Int? = null,
    val publishedAt: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
