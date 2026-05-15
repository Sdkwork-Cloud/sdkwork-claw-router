package com.sdkwork.clawrouter.app

data class PlusCommentsRecord(
    val author: Map<String, String>? = null,
    val deviceInfo: String? = null,
    val ipAddress: String? = null,
    val parentId: String? = null,
    val path: String? = null,
    val userId: String? = null
)
