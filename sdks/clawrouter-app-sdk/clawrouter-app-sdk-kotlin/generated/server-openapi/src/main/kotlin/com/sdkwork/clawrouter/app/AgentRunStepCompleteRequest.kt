package com.sdkwork.clawrouter.app

data class AgentRunStepCompleteRequest(
    val errorMessageMasked: String? = null,
    val metadata: Map<String, String>? = null,
    val outputJson: Map<String, String>? = null,
    val status: String? = null,
    val usageJson: UsageSnapshot? = null
)
