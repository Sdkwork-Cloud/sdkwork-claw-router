package com.sdkwork.clawrouter.backend

data class OpsNotificationMessageRecord(
    val actionUrl: String? = null,
    val content: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val expireAt: String? = null,
    val id: String? = null,
    val messageCode: String? = null,
    val messageType: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val publishedAt: String? = null,
    val severity: String? = null,
    val status: String? = null,
    val summary: String? = null,
    val targetOwnerId: String? = null,
    val targetOwnerType: String? = null,
    val targetScope: String? = null,
    val targetUserId: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
