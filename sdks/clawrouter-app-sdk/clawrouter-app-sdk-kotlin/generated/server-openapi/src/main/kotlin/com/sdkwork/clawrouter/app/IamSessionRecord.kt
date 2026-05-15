package com.sdkwork.clawrouter.app

data class IamSessionRecord(
    val accessTokenHash: String? = null,
    val appId: String? = null,
    val authLevel: String? = null,
    val authTokenHash: String? = null,
    val createdAt: String? = null,
    val dataScopeJson: Map<String, String>? = null,
    val deploymentMode: String? = null,
    val environment: String? = null,
    val expiresAt: String? = null,
    val id: String? = null,
    val organizationId: String? = null,
    val permissionScopeJson: Map<String, String>? = null,
    val refreshTokenHash: String? = null,
    val revokedAt: String? = null,
    val shardingKey: String? = null,
    val shardingStrategy: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null
)
