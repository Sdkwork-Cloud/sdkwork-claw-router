package com.sdkwork.clawrouter.app

data class AccountSecuritySummary(
    val ipWhitelistCount: Int? = null,
    val mfaEnabled: Boolean? = null,
    val qpsLimit: Int? = null
)
