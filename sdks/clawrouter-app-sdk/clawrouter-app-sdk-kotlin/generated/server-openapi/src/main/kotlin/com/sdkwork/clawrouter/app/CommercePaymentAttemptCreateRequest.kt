package com.sdkwork.clawrouter.app

data class CommercePaymentAttemptCreateRequest(
    val clientRequestNo: String? = null,
    val methodCode: String? = null,
    val note: String? = null,
    val providerCode: String? = null,
    val returnUrl: String? = null
)
