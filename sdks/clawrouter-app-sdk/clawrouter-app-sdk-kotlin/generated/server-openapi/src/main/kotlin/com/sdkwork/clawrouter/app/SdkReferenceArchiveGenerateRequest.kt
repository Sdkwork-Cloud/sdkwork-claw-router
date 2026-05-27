package com.sdkwork.clawrouter.app

data class SdkReferenceArchiveGenerateRequest(
    val config: Map<String, Any>? = null,
    val language: String? = null,
    val spec: Map<String, String>? = null
)
