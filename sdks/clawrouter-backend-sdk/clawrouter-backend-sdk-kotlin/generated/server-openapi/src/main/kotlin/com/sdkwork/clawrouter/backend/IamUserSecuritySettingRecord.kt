package com.sdkwork.clawrouter.backend

data class IamUserSecuritySettingRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val lastLoginAt: String? = null,
    val lastLoginIpHash: String? = null,
    val metadata: Map<String, String>? = null,
    val mfaEnabled: Boolean? = null,
    val mfaMethod: String? = null,
    val organizationId: String? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val passwordLastChangedAt: String? = null,
    val securityLevel: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val thirdPartyBoundSnapshot: Map<String, String>? = null,
    val trustedDeviceCount: Int? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
