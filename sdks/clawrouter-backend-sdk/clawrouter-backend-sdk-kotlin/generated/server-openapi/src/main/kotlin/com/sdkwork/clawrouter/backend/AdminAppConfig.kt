package com.sdkwork.clawrouter.backend

data class AdminAppConfig(
    val portal: AdminAppPortalConfig? = null,
    val standard: AdminAppConfigStandard? = null
)
