package com.sdkwork.clawrouter.backend

data class CommerceStandardCommandRequest(
    val clientRequestNo: String? = null,
    val metadata: Map<String, String>? = null,
    val note: String? = null
)
