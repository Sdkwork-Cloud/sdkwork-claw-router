package com.sdkwork.clawrouter.app

data class AgentRunStepItem(
    val cachedTokens: Int? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val inputTokens: Int? = null,
    val latencyMs: Int? = null,
    val model: String? = null,
    val outputTokens: Int? = null,
    val runId: String? = null,
    val runtimeInvocationId: String? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val stepIndex: Int? = null,
    val stepType: String? = null,
    val title: String? = null,
    val toolName: String? = null,
    val totalTokens: Int? = null
)
