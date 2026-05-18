package com.sdkwork.clawrouter.backend

data class AdminAgentVersionItem(
    val createdAt: String? = null,
    val id: String? = null,
    val mcpPolicy: Map<String, String>? = null,
    val memoryPolicy: Map<String, String>? = null,
    val model: String? = null,
    val releaseStatus: String? = null,
    val runtimePolicy: Map<String, String>? = null,
    val skillPolicy: Map<String, String>? = null,
    val systemPrompt: String? = null,
    val toolPolicy: Map<String, String>? = null,
    val updatedAt: String? = null,
    val versionNo: Int? = null
)
