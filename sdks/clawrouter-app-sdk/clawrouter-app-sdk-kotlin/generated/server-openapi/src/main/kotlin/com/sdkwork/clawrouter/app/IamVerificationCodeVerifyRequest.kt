package com.sdkwork.clawrouter.app

data class IamVerificationCodeVerifyRequest(
    val code: String? = null,
    val codeId: String? = null,
    val scene: String? = null,
    val target: String? = null,
    val verifyType: String? = null
)
