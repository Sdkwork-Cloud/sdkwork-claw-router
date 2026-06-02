package com.sdkwork.clawrouter.app

data class CommerceRechargeOrderCreateRequest(
    val amount: String? = null,
    val clientRequestNo: String? = null,
    val currencyCode: String? = null,
    val packageId: String? = null,
    val source: String? = null
)
