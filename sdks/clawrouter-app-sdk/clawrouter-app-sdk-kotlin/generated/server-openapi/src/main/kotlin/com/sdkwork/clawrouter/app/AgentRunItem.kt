package com.sdkwork.clawrouter.app

data class AgentRunItem(
    val agentId: String? = null,
    val agentVersionId: String? = null,
    val cachedTokens: String? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val errorMessageMasked: String? = null,
    val executionMode: String? = null,
    val id: String? = null,
    val inputMessage: String? = null,
    val inputTokens: String? = null,
    val memorySpaceId: String? = null,
    val model: String? = null,
    val outputMessage: String? = null,
    val outputTokens: String? = null,
    val requestId: String? = null,
    val runtime: String? = null,
    val sessionId: String? = null,
    val sourceSurface: String? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val totalSteps: String? = null,
    val totalTokens: String? = null,
    val traceId: String? = null
)
