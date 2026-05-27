package com.sdkwork.clawrouter.backend

data class AdminMcpBindingCreateRequest(
    val allowedTools: List<String>? = null,
    val deniedTools: List<String>? = null,
    val enabled: Boolean? = null,
    val ownerId: Int? = null,
    val ownerType: String? = null,
    val policyJson: Map<String, String>? = null,
    val priority: Int? = null,
    val serverRevisionId: Int? = null,
    val status: String? = null,
    val toolId: Int? = null
)
