package com.sdkwork.clawrouter.app

data class AgentRunCompleteRequest(
    val errorMessageMasked: String? = null,
    val metadata: Map<String, String>? = null,
    val outputMessage: String? = null,
    val status: String? = null,
    val usageJson: UsageSnapshot? = null
)
