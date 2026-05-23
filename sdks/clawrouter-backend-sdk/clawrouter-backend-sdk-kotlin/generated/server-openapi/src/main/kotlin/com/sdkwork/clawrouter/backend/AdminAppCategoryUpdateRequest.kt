package com.sdkwork.clawrouter.backend

data class AdminAppCategoryUpdateRequest(
    val code: String? = null,
    val description: String? = null,
    val icon: String? = null,
    val name: String? = null,
    val parentId: String? = null,
    val path: String? = null,
    val sortWeight: Int? = null,
    val status: Int? = null,
    val visible: Boolean? = null
)
