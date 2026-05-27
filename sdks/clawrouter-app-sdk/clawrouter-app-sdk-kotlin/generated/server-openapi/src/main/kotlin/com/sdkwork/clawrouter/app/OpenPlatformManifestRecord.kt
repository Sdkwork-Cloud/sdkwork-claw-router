package com.sdkwork.clawrouter.app

data class OpenPlatformManifestRecord(
    val accountType: String? = null,
    val callbackSchema: Map<String, String>? = null,
    val capabilitySchema: Map<String, String>? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val entrySchema: Map<String, String>? = null,
    val id: String? = null,
    val manifestKey: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val provider: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
