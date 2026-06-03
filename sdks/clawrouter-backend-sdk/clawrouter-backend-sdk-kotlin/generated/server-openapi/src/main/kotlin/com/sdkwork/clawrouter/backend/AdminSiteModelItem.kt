package com.sdkwork.clawrouter.backend

data class AdminSiteModelItem(
    val capabilities: List<String>? = null,
    val consecutiveErrorCount: Int? = null,
    val contextTokens: Int? = null,
    val displayName: String? = null,
    val healthStatus: String? = null,
    val id: String? = null,
    val lastLatencyMs: Int? = null,
    val lastSyncAt: String? = null,
    val maxInputTokens: Int? = null,
    val maxOutputTokens: Int? = null,
    val modality: String? = null,
    val modelCode: String? = null,
    val modelName: String? = null,
    val providerModel: String? = null,
    val providerNativeModel: String? = null,
    val serviceType: String? = null,
    val siteCode: String? = null,
    val siteId: String? = null,
    val siteServiceCode: String? = null,
    val siteServiceId: String? = null,
    val status: String? = null,
    val supportsJsonSchema: Boolean? = null,
    val supportsStreaming: Boolean? = null,
    val supportsTools: Boolean? = null,
    val vendorCode: String? = null
)
