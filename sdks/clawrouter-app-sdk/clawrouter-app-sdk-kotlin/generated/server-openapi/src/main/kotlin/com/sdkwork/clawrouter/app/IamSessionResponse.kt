package com.sdkwork.clawrouter.app

data class IamSessionResponse(
    val accessToken: String? = null,
    val authToken: String? = null,
    val context: IamAppContext? = null,
    val expiresAt: String? = null,
    val refreshToken: String? = null,
    val sessionId: String? = null,
    val user: IamUserResponse? = null
)
