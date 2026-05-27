package com.sdkwork.clawrouter.app

data class CommerceProductSkuItem(
    val attributes: List<CommerceProductSkuAttributeItem>? = null,
    val createdAt: String? = null,
    val defaultCurrencyCode: String? = null,
    val defaultPriceAmount: String? = null,
    val fulfillmentType: String? = null,
    val id: String? = null,
    val productId: String? = null,
    val publishedAt: String? = null,
    val salesUnit: String? = null,
    val skuNo: String? = null,
    val status: String? = null,
    val taxCategory: String? = null,
    val title: String? = null,
    val updatedAt: String? = null
)
