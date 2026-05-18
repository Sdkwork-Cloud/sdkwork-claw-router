package com.sdkwork.clawrouter.app

data class IamDeviceRecord(
    val createdAt: String? = null,
    val deviceFingerprint: String? = null,
    val id: String? = null,
    val lastSeenAt: String? = null,
    val name: String? = null,
    val tenantId: String? = null,
    val trusted: Boolean? = null,
    val userId: String? = null
)
