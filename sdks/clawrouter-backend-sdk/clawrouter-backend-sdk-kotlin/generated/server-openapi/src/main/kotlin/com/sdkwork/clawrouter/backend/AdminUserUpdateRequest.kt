package com.sdkwork.clawrouter.backend

data class AdminUserUpdateRequest(
    val group: String? = null,
    val id: Int? = null,
    val status: String? = null,
    val username: String? = null
)
