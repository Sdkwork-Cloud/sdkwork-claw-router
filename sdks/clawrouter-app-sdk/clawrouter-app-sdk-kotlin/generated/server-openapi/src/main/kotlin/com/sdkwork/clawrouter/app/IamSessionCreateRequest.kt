package com.sdkwork.clawrouter.app

data class IamSessionCreateRequest(
    val code: String? = null,
    val deviceId: String? = null,
    val deviceName: String? = null,
    val deviceType: String? = null,
    val email: String? = null,
    val grantType: String? = null,
    val name: String? = null,
    val organizationCode: String? = null,
    val password: String? = null,
    val phone: String? = null,
    val subject: String? = null,
    val tenantCode: String? = null,
    val username: String? = null
)
