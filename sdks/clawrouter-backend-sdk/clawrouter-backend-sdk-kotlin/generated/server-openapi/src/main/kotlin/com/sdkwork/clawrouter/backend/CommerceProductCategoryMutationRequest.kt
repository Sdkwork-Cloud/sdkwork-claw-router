package com.sdkwork.clawrouter.backend

data class CommerceProductCategoryMutationRequest(
    val categoryNo: String? = null,
    val name: String? = null,
    val parentId: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null
)
