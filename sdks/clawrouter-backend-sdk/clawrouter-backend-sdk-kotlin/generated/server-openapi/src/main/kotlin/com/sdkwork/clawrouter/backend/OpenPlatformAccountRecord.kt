package com.sdkwork.clawrouter.backend

data class OpenPlatformAccountRecord(
    val accountKey: String? = null,
    val accountType: String? = null,
    val aesKeyRef: String? = null,
    val appId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val defaultEntryId: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val provider: String? = null,
    val qrDefault: Boolean? = null,
    val secretRef: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val tokenRef: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
