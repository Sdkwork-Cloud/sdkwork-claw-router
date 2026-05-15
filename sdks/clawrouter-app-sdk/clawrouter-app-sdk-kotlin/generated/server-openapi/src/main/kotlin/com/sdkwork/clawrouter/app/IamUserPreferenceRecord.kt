package com.sdkwork.clawrouter.app

data class IamUserPreferenceRecord(
    val appearanceConfig: Map<String, String>? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val defaultConsolePath: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val language: String? = null,
    val metadata: Map<String, String>? = null,
    val notificationPreferences: Map<String, String>? = null,
    val organizationId: String? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val themeMode: String? = null,
    val timezone: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
