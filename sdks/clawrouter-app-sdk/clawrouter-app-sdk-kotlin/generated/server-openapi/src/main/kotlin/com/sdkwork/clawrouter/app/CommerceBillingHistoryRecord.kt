package com.sdkwork.clawrouter.app

data class CommerceBillingHistoryRecord(
    val assetType: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val direction: String? = null,
    val historyNo: String? = null,
    val historyType: String? = null,
    val metadataJson: Map<String, String>? = null,
    val occurredAt: String? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val paymentMethod: String? = null,
    val referenceNo: String? = null,
    val relatedOrderId: String? = null,
    val relatedOrderNo: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null
)
