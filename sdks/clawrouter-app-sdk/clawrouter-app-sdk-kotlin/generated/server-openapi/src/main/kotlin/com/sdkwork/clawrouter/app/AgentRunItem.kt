package com.sdkwork.clawrouter.app

data class AgentRunItem(
    val agentId: String? = null,
    val agentVersionId: String? = null,
    val cachedTokens: Int? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val errorMessageMasked: String? = null,
    val executionMode: String? = null,
    val id: String? = null,
    val inputMessage: String? = null,
    val inputTokens: Int? = null,
    val memorySpaceId: String? = null,
    val model: String? = null,
    val outputMessage: String? = null,
    val outputTokens: Int? = null,
    val requestId: String? = null,
    val runtime: String? = null,
    val sessionId: String? = null,
    val sourceSurface: String? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val totalSteps: Int? = null,
    val totalTokens: Int? = null,
    val traceId: String? = null
)
