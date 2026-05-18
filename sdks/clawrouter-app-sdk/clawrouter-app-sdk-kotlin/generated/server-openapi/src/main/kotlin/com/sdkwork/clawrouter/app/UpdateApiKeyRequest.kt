package com.sdkwork.clawrouter.app

data class UpdateApiKeyRequest(
    val expires: String? = null,
    val group: String? = null,
    val ipLimit: String? = null,
    val isUnlimitedQuota: Boolean? = null,
    val modalities: List<String>? = null,
    val name: String? = null,
    val quota: String? = null
)
