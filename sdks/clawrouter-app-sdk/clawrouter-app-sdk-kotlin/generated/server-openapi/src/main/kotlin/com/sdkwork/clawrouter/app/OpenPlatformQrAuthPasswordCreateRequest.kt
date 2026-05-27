package com.sdkwork.clawrouter.app

data class OpenPlatformQrAuthPasswordCreateRequest(
    val channel: String? = null,
    val confirmPassword: String? = null,
    val email: String? = null,
    val password: String? = null,
    val phone: String? = null,
    val username: String? = null,
    val verificationCode: String? = null
)
