package com.sdkwork.clawrouter.app

data class CommerceShipmentTrackingEventRecord(
    val createdAt: String? = null,
    val description: String? = null,
    val eventCode: String? = null,
    val eventTime: String? = null,
    val location: String? = null,
    val organizationId: String? = null,
    val rawPayloadJson: Map<String, String>? = null,
    val shipmentId: String? = null,
    val tenantId: String? = null
)
