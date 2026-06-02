package com.sdkwork.clawrouter.app

data class CommerceCartItemRecord(
    val cartId: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val metadataJson: Map<String, String>? = null,
    val organizationId: String? = null,
    val priceSnapshotJson: Map<String, String>? = null,
    val quantity: String? = null,
    val selected: Boolean? = null,
    val skuId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
