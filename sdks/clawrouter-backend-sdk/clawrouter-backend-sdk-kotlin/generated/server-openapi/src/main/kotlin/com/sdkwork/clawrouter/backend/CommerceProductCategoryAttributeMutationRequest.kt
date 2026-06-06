package com.sdkwork.clawrouter.backend

data class CommerceProductCategoryAttributeMutationRequest(
    val attributeId: String? = null,
    val categoryId: String? = null,
    val filterable: Boolean? = null,
    val required: Boolean? = null,
    val searchable: Boolean? = null,
    val sortOrder: String? = null,
    val status: String? = null
)
