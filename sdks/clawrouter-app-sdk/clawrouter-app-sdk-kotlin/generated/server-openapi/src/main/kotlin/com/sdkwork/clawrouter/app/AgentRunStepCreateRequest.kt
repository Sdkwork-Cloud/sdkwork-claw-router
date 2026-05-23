package com.sdkwork.clawrouter.app

data class AgentRunStepCreateRequest(
    val inputJson: Map<String, String>? = null,
    val metadata: Map<String, String>? = null,
    val model: String? = null,
    val outputJson: Map<String, String>? = null,
    val runtimeInvocationId: String? = null,
    val status: String? = null,
    val stepType: String? = null,
    val title: String? = null,
    val toolName: String? = null,
    val usageJson: UsageSnapshot? = null
)
