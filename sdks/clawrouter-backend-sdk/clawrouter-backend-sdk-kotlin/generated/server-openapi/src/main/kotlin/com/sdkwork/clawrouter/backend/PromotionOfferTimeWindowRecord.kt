package com.sdkwork.clawrouter.backend

data class PromotionOfferTimeWindowRecord(
    val createdAt: String? = null,
    val endsAt: String? = null,
    val localEndTime: String? = null,
    val localStartTime: String? = null,
    val offerVersionId: String? = null,
    val organizationId: String? = null,
    val startsAt: String? = null,
    val tenantId: String? = null,
    val timezone: String? = null,
    val updatedAt: String? = null,
    val weekdayMask: Int? = null,
    val windowType: String? = null
)
