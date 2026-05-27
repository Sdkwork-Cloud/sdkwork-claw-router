package com.sdkwork.clawrouter.backend

data class OpenPlatformAccountUpdateRequest(
    val appId: String? = null,
    val appSecret: String? = null,
    val defaultEntryId: String? = null,
    val encodingAesKey: String? = null,
    val name: String? = null,
    val qrDefault: Boolean? = null,
    val status: String? = null,
    val token: String? = null
)
