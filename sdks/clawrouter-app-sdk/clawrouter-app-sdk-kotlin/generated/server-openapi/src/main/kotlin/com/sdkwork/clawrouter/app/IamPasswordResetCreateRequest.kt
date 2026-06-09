package com.sdkwork.clawrouter.app

data class IamPasswordResetCreateRequest(
    val account: String? = null,
    val code: String? = null,
    val confirmPassword: String? = null,
    val newPassword: String? = null
)
