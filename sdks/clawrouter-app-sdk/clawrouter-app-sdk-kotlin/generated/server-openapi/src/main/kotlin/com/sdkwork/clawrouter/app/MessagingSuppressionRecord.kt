package com.sdkwork.clawrouter.app

data class MessagingSuppressionRecord(
    val channel: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val endsAt: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val note: String? = null,
    val organizationId: String? = null,
    val reasonCode: String? = null,
    val scopeId: String? = null,
    val scopeType: String? = null,
    val source: String? = null,
    val startsAt: String? = null,
    val status: String? = null,
    val targetHash: String? = null,
    val targetMasked: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
