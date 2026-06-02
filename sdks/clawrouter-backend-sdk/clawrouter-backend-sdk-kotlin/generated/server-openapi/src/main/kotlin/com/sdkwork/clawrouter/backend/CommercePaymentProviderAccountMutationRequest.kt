package com.sdkwork.clawrouter.backend

data class CommercePaymentProviderAccountMutationRequest(
    val accountRole: String? = null,
    val certificateRef: String? = null,
    val clientRequestNo: String? = null,
    val countryCode: String? = null,
    val environment: String? = null,
    val merchantId: String? = null,
    val note: String? = null,
    val providerCode: String? = null,
    val rotatedAt: String? = null,
    val secretRef: String? = null,
    val settlementCurrency: String? = null,
    val status: String? = null,
    val webhookSecretRef: String? = null
)
