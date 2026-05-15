package com.sdkwork.clawrouter.app

data class IamLoginQrCodeStatusResponse(
    val session: IamSessionResponse? = null,
    val status: String? = null,
    val token: IamSessionResponse? = null,
    val userInfo: IamUserResponse? = null
)
