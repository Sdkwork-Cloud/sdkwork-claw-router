package com.sdkwork.clawrouter.backend

data class OpenPlatformAccountCreateRequest(
    val aesKeyRef: String? = null,
    val appId: String? = null,
    val key: String? = null,
    val name: String? = null,
    val provider: String? = null,
    val secretRef: String? = null,
    val tokenRef: String? = null,
    val type: String? = null
)
