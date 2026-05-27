package com.sdkwork.clawrouter.app

data class OpenPlatformQrAuthScanCreateRequest(
    val accountId: String? = null,
    val entryId: String? = null,
    val externalUserId: String? = null,
    val ipHash: String? = null,
    val scanSource: String? = null,
    val userAgent: String? = null
)
