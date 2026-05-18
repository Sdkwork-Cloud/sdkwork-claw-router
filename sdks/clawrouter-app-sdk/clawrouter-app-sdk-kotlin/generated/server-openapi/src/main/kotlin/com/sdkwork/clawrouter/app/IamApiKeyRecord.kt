package com.sdkwork.clawrouter.app

data class IamApiKeyRecord(
    val createdAt: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val keyHash: String? = null,
    val name: String? = null,
    val permissionScopeJson: Map<String, String>? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null
)
