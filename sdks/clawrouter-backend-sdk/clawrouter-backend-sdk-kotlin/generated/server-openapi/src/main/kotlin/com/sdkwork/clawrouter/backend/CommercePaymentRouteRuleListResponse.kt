package com.sdkwork.clawrouter.backend

data class CommercePaymentRouteRuleListResponse(
    val items: List<CommercePaymentRouteRuleItem>? = null,
    val page: String? = null,
    val pageSize: String? = null,
    val total: String? = null
)
