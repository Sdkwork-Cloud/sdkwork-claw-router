package com.sdkwork.clawrouter.app

data class MessagingSenderIdentityRecord(
    val countryCode: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val displayName: String? = null,
    val domainName: String? = null,
    val fromEmail: String? = null,
    val fromName: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val rejectionReason: String? = null,
    val replyTo: String? = null,
    val senderId: String? = null,
    val signName: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val verifiedAt: String? = null,
    val version: String? = null
)
