package com.sdkwork.clawrouter.app

data class AuthVerificationPolicy(
    val emailCodeLoginEnabled: Boolean? = null,
    val emailRegistrationVerificationRequired: Boolean? = null,
    val phoneCodeLoginEnabled: Boolean? = null,
    val phoneRegistrationVerificationRequired: Boolean? = null
)
