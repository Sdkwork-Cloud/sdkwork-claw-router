package com.sdkwork.clawrouter.app

data class SdkReferenceDocumentationGenerateRequest(
    val config: Map<String, Any>? = null,
    val language: String? = null,
    val spec: Map<String, String>? = null
)
