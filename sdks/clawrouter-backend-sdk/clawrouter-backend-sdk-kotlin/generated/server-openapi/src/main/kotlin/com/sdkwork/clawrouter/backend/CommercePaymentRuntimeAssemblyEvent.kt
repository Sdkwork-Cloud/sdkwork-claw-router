package com.sdkwork.clawrouter.backend

data class CommercePaymentRuntimeAssemblyEvent(
    val accountNo: String? = null,
    val kind: String? = null,
    val message: String? = null,
    val providerCode: String? = null,
    val reason: String? = null
)
