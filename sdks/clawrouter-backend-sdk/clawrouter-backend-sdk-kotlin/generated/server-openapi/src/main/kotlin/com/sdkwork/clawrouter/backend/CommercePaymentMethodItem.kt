package com.sdkwork.clawrouter.backend

data class CommercePaymentMethodItem(
    val checkoutScenes: List<String>? = null,
    val createdAt: String? = null,
    val displayName: String? = null,
    val id: String? = null,
    val methodCode: String? = null,
    val methodType: String? = null,
    val providerCode: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val updatedAt: String? = null
)
