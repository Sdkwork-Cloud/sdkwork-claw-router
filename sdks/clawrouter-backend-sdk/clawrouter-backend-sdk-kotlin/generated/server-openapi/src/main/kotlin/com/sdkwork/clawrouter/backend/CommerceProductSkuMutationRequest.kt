package com.sdkwork.clawrouter.backend

data class CommerceProductSkuMutationRequest(
    val attributes: List<CommerceProductSkuAttributeItem>? = null,
    val defaultCurrencyCode: String? = null,
    val defaultPriceAmount: String? = null,
    val fulfillmentType: String? = null,
    val productId: String? = null,
    val salesUnit: String? = null,
    val skuNo: String? = null,
    val status: String? = null,
    val taxCategory: String? = null,
    val title: String? = null
)
