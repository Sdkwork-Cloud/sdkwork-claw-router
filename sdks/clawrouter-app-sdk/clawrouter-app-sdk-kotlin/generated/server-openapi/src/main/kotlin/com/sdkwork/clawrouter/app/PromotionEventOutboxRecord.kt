package com.sdkwork.clawrouter.app

data class PromotionEventOutboxRecord(
    val aggregateId: String? = null,
    val aggregateType: String? = null,
    val createdAt: String? = null,
    val eventNo: String? = null,
    val eventType: String? = null,
    val eventVersion: Int? = null,
    val nextRetryAt: String? = null,
    val occurredAt: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val payloadJson: Map<String, String>? = null,
    val publishedAt: String? = null,
    val status: String? = null,
    val tenantId: String? = null
)
