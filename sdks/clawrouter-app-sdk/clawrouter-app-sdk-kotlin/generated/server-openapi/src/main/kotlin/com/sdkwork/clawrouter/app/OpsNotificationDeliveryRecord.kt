package com.sdkwork.clawrouter.app

data class OpsNotificationDeliveryRecord(
    val appId: String? = null,
    val archivedAt: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val deliveredAt: String? = null,
    val deliveryChannel: String? = null,
    val deliveryStatus: String? = null,
    val failureCode: String? = null,
    val id: String? = null,
    val messageId: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val popupSeenAt: String? = null,
    val readAt: String? = null,
    val retryCount: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val userId: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
