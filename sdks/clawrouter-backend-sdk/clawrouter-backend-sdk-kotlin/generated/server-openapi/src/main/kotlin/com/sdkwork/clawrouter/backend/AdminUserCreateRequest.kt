package com.sdkwork.clawrouter.backend

data class AdminUserCreateRequest(
    val balance: String? = null,
    val email: String? = null,
    val username: String? = null
)
