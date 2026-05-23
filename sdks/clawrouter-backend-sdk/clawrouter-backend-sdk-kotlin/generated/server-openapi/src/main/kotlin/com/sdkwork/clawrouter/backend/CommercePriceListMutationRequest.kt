package com.sdkwork.clawrouter.backend

data class CommercePriceListMutationRequest(
    val currencyCode: String? = null,
    val customerSegment: String? = null,
    val endsAt: String? = null,
    val marketCode: String? = null,
    val priceListNo: String? = null,
    val startsAt: String? = null,
    val status: String? = null
)
