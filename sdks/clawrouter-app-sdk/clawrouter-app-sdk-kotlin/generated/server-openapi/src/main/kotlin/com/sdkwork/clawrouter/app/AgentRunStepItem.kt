package com.sdkwork.clawrouter.app

data class AgentRunStepItem(
    val cachedTokens: String? = null,
    val completedAt: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val inputTokens: String? = null,
    val latencyMs: String? = null,
    val model: String? = null,
    val outputTokens: String? = null,
    val runId: String? = null,
    val runtimeInvocationId: String? = null,
    val startedAt: String? = null,
    val status: String? = null,
    val stepIndex: String? = null,
    val stepType: String? = null,
    val title: String? = null,
    val toolName: String? = null,
    val totalTokens: String? = null
)
