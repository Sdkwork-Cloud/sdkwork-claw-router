package com.sdkwork.clawrouter.app

data class AiRuntimeInvocationEventRecord(
    val agentRunId: String? = null,
    val agentRunStepId: String? = null,
    val agentSessionId: String? = null,
    val chatTurnId: String? = null,
    val conversationId: String? = null,
    val createdAt: String? = null,
    val eventNo: String? = null,
    val eventSource: String? = null,
    val eventType: String? = null,
    val id: String? = null,
    val invocationId: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val payloadJson: Map<String, String>? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val textDelta: String? = null,
    val traceId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
