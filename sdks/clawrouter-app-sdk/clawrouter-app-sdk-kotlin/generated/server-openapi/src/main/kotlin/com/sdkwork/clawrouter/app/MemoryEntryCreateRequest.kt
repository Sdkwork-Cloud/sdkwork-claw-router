package com.sdkwork.clawrouter.app

data class MemoryEntryCreateRequest(
    val confidenceScore: String? = null,
    val content: String? = null,
    val contentJson: Map<String, String>? = null,
    val importanceScore: String? = null,
    val memoryType: String? = null,
    val metadata: Map<String, String>? = null,
    val sensitivityLevel: String? = null,
    val sourceConversationId: String? = null,
    val sourceInvocationId: String? = null,
    val sourceItemId: String? = null,
    val sourceKind: String? = null,
    val sourceTurnId: String? = null,
    val status: String? = null,
    val subjectKey: String? = null,
    val subjectType: String? = null,
    val trustLevel: String? = null
)
