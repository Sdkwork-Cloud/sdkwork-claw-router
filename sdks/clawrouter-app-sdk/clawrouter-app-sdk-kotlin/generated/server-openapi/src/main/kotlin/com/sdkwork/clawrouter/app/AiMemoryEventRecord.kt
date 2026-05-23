package com.sdkwork.clawrouter.app

data class AiMemoryEventRecord(
    val actorId: String? = null,
    val actorType: String? = null,
    val afterJson: Map<String, String>? = null,
    val beforeJson: Map<String, String>? = null,
    val conversationId: String? = null,
    val createdAt: String? = null,
    val decisionReason: String? = null,
    val eventType: String? = null,
    val id: String? = null,
    val invocationId: String? = null,
    val legalHold: Boolean? = null,
    val memoryId: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val spaceId: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val turnId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
