package com.sdkwork.clawrouter.app

data class IamCurrentSessionUpdateRequest(
    val deviceName: String? = null,
    val organizationCode: String? = null,
    val organizationId: String? = null
)
