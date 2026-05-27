package com.sdkwork.clawrouter.app

data class OpenPlatformQrAuthSessionResponse(
    val completedAt: String? = null,
    val createdAt: String? = null,
    val defaultAccountId: String? = null,
    val defaultAccountType: String? = null,
    val defaultEntryId: String? = null,
    val defaultProvider: String? = null,
    val expiresAt: String? = null,
    val fallbackUrl: String? = null,
    val id: String? = null,
    val purpose: String? = null,
    val qrContent: Map<String, Any>? = null,
    val scannedAt: String? = null,
    val session: IamSessionResponse? = null,
    val sessionKey: String? = null,
    val status: String? = null,
    val token: IamSessionResponse? = null,
    val updatedAt: String? = null,
    val userInfo: IamUserResponse? = null
)
