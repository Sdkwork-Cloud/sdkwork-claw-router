package com.sdkwork.clawrouter.backend

data class CommerceProductSpuItem(
    val brand: String? = null,
    val categoryId: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val defaultSkuId: String? = null,
    val description: String? = null,
    val id: String? = null,
    val media: List<CommerceProductMediaItem>? = null,
    val minPriceAmount: String? = null,
    val productType: String? = null,
    val publishedAt: String? = null,
    val spuNo: String? = null,
    val status: String? = null,
    val subtitle: String? = null,
    val title: String? = null,
    val updatedAt: String? = null
)
