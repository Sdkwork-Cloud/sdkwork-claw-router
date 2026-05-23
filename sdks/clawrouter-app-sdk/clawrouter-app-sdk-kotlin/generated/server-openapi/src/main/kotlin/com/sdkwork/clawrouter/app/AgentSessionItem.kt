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
    val lastStepId: Int? = null,
    val memorySpaceId: String? = null,
    val permissionMode: String? = null,
    val runCount: Int? = null,
    val runtime: String? = null,
    val sandboxPolicy: String? = null,
    val sessionKind: String? = null,
    val sourceSurface: String? = null,
    val status: String? = null,
    val stepCount: Int? = null,
    val title: String? = null,
    val toolCallCount: Int? = null,
    val updatedAt: String? = null
)
