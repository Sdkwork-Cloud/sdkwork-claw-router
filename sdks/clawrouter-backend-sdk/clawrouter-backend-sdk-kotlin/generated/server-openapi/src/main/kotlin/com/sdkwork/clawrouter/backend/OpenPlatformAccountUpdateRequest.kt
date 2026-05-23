package com.sdkwork.clawrouter.backend

data class OpenPlatformAccountUpdateRequest(
    val aesKeyRef: String? = null,
    val appId: String? = null,
    val defaultEntryId: String? = null,
    val name: String? = null,
    val qrDefault: Boolean? = null,
    val secretRef: String? = null,
    val status: String? = null,
    val tokenRef: String? = null
)
