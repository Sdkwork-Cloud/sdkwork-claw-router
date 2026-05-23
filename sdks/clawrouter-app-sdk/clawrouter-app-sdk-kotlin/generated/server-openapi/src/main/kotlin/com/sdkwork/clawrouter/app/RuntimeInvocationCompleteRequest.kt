package com.sdkwork.clawrouter.app

data class RuntimeInvocationCompleteRequest(
    val errorCode: String? = null,
    val errorMessageMasked: String? = null,
    val errorType: String? = null,
    val exitCode: Int? = null,
    val finishReason: String? = null,
    val latencyMs: Int? = null,
    val metadata: Map<String, String>? = null,
    val providerConversationId: String? = null,
    val providerResponseId: String? = null,
    val providerSessionId: String? = null,
    val providerStepId: String? = null,
    val responseJson: Map<String, String>? = null,
    val status: String? = null,
    val ttftMs: Int? = null,
    val usageJson: UsageSnapshot? = null
)
