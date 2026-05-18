package com.sdkwork.clawrouter.app

data class AgentCreateRequest(
    val code: String? = null,
    val description: String? = null,
    val mcpPolicy: Map<String, String>? = null,
    val memoryPolicy: Map<String, String>? = null,
    val model: String? = null,
    val name: String? = null,
    val runtimePolicy: Map<String, String>? = null,
    val skillPolicy: Map<String, String>? = null,
    val systemPrompt: String? = null,
    val toolPolicy: Map<String, String>? = null
)
