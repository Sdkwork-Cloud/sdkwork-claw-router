package com.sdkwork.clawrouter.backend

data class CommerceProductSpuMutationRequest(
    val brand: String? = null,
    val categoryId: String? = null,
    val description: String? = null,
    val productType: String? = null,
    val spuNo: String? = null,
    val status: String? = null,
    val subtitle: String? = null,
    val title: String? = null
)
