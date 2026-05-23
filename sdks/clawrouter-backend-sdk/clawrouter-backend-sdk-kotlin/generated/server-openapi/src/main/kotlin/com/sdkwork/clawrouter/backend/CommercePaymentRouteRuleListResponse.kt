package com.sdkwork.clawrouter.backend

data class CommercePaymentRouteRuleListResponse(
    val items: List<CommercePaymentRouteRuleItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
