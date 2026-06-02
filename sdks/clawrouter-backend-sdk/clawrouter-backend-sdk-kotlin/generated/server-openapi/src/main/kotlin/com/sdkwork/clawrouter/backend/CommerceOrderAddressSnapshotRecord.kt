package com.sdkwork.clawrouter.backend

data class CommerceOrderAddressSnapshotRecord(
    val addressLine1Encrypted: String? = null,
    val capturedAt: String? = null,
    val city: String? = null,
    val countryCode: String? = null,
    val district: String? = null,
    val id: String? = null,
    val orderId: String? = null,
    val organizationId: String? = null,
    val phoneMasked: String? = null,
    val postalCode: String? = null,
    val recipientNameSnapshot: String? = null,
    val regionCode: String? = null,
    val snapshotVersion: String? = null,
    val sourceAddressId: String? = null,
    val tenantId: String? = null
)
