package com.sdkwork.clawrouter.app

data class RoutingRequestTraceItem(
    val channel: String? = null,
    val duration: String? = null,
    val endedAt: String? = null,
    val errorMessageMasked: String? = null,
    val errorType: String? = null,
    val httpMethod: String? = null,
    val id: String? = null,
    val model: String? = null,
    val providerErrorCode: String? = null,
    val requestBytes: Int? = null,
    val requestId: String? = null,
    val requestPath: String? = null,
    val requestPayloadHash: String? = null,
    val responseBytes: Int? = null,
    val responsePayloadHash: String? = null,
    val startedAt: String? = null,
    val status: Int? = null,
    val streaming: Boolean? = null,
    val time: String? = null,
    val tokens: Int? = null,
    val traceId: String? = null
)
