package com.sdkwork.clawrouter.app

data class AgentRunCreateRequest(
    val agentId: String? = null,
    val agentVersionId: String? = null,
    val executionMode: String? = null,
    val inputMessage: String? = null,
    val memorySpaceId: String? = null,
    val metadata: Map<String, String>? = null,
    val model: String? = null,
    val runtime: String? = null,
    val sourceSurface: String? = null,
    val traceId: String? = null
)
