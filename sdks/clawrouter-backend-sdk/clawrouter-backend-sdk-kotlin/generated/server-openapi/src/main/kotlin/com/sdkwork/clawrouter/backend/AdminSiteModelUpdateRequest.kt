package com.sdkwork.clawrouter.backend

data class AdminSiteModelUpdateRequest(
    val capabilities: List<String>? = null,
    val contextTokens: Int? = null,
    val displayName: String? = null,
    val maxInputTokens: Int? = null,
    val maxOutputTokens: Int? = null,
    val modality: String? = null,
    val modelCode: String? = null,
    val modelName: String? = null,
    val providerModel: String? = null,
    val providerNativeModel: String? = null,
    val status: String? = null,
    val supportsJsonSchema: Boolean? = null,
    val supportsStreaming: Boolean? = null,
    val supportsTools: Boolean? = null,
    val vendorCode: String? = null
)
