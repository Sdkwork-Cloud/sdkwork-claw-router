package com.sdkwork.clawrouter.backend

data class AiChannelGroupMemberRecord(
    val channelGroupId: String? = null,
    val channelId: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val effectiveFrom: String? = null,
    val effectiveTo: String? = null,
    val enabled: Boolean? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val priority: Int? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val weight: Int? = null
)
