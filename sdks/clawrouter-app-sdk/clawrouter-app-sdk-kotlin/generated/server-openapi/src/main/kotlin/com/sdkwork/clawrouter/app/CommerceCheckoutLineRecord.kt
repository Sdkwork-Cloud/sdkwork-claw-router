package com.sdkwork.clawrouter.app

data class CommerceCheckoutLineRecord(
    val checkoutSessionId: String? = null,
    val createdAt: String? = null,
    val fulfillmentType: String? = null,
    val id: String? = null,
    val inventoryReservationId: String? = null,
    val organizationId: String? = null,
    val priceSnapshotJson: Map<String, String>? = null,
    val promotionSnapshotJson: Map<String, String>? = null,
    val purchaseType: String? = null,
    val quantity: String? = null,
    val skuId: String? = null,
    val tenantId: String? = null
)
