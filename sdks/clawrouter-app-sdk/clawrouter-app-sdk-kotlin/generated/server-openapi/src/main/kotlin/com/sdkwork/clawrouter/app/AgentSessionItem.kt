package com.sdkwork.clawrouter.app

data class AgentSessionItem(
    val agentId: String? = null,
    val agentVersionId: String? = null,
    val approvalPolicy: String? = null,
    val chatConversationId: String? = null,
    val createdAt: String? = null,
    val cwd: String? = null,
    val defaultModel: String? = null,
    val id: String? = null,
    val lastActiveAt: String? = null,
    val lastRunId: String? = null,
    val lastStepId: String? = null,
    val memorySpaceId: String? = null,
    val permissionMode: String? = null,
    val runCount: String? = null,
    val runtime: String? = null,
    val sandboxPolicy: String? = null,
    val sessionKind: String? = null,
    val sourceSurface: String? = null,
    val status: String? = null,
    val stepCount: String? = null,
    val title: String? = null,
    val toolCallCount: String? = null,
    val updatedAt: String? = null
)
