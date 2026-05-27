package com.sdkwork.clawrouter.backend

data class OpenPlatformAccountCreateRequest(
    val appId: String? = null,
    val appSecret: String? = null,
    val encodingAesKey: String? = null,
    val key: String? = null,
    val name: String? = null,
    val provider: String? = null,
    val token: String? = null,
    val type: String? = null
)
