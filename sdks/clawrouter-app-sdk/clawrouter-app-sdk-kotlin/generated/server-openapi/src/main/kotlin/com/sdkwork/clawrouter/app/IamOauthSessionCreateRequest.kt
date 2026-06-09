package com.sdkwork.clawrouter.app

data class IamOauthSessionCreateRequest(
    val code: String? = null,
    val deviceId: String? = null,
    val deviceType: String? = null,
    val provider: String? = null,
    val state: String? = null
)
