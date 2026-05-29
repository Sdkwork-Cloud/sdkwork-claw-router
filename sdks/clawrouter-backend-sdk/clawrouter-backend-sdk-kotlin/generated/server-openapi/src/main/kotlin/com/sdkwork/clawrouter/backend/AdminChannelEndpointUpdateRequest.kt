package com.sdkwork.clawrouter.backend

data class AdminChannelEndpointUpdateRequest(
    val apiEndpointCode: String? = null,
    val baseUrl: String? = null,
    val effectiveFrom: String? = null,
    val effectiveTo: String? = null,
    val priority: Int? = null,
    val regionCode: String? = null,
    val status: String? = null,
    val vendorCode: String? = null,
    val weight: Int? = null
)
