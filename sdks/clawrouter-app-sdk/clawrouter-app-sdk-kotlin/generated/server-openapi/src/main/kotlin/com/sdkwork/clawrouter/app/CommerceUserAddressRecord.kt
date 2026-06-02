package com.sdkwork.clawrouter.app

data class CommerceUserAddressRecord(
    val addressLine1Encrypted: String? = null,
    val addressLine2Encrypted: String? = null,
    val city: String? = null,
    val countryCode: String? = null,
    val createdAt: String? = null,
    val district: String? = null,
    val id: String? = null,
    val isDefault: Boolean? = null,
    val organizationId: String? = null,
    val ownerUserId: String? = null,
    val phoneCountryCode: String? = null,
    val phoneMasked: String? = null,
    val phoneNumberEncrypted: String? = null,
    val postalCode: String? = null,
    val recipientName: String? = null,
    val regionCode: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
