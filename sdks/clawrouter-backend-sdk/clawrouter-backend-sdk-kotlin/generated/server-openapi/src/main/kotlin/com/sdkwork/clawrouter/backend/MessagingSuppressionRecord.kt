package com.sdkwork.clawrouter.backend

data class MessagingSuppressionRecord(
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val endsAt: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val note: String? = null,
    val organizationId: String? = null,
    val status: String? = null,
    val targetMasked: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
