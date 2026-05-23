package com.sdkwork.clawrouter.app

data class AgentSessionCreateRequest(
    val agentVersionId: String? = null,
    val approvalPolicy: String? = null,
    val chatConversationId: String? = null,
    val cwd: String? = null,
    val defaultModel: String? = null,
    val memorySpaceId: String? = null,
    val metadata: Map<String, String>? = null,
    val permissionMode: String? = null,
    val runtime: String? = null,
    val sandboxPolicy: String? = null,
    val sessionKind: String? = null,
    val sourceSurface: String? = null,
    val title: String? = null
)
