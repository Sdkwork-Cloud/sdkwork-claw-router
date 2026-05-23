package com.sdkwork.clawrouter.backend

data class CommerceMembershipPackageMutationRequest(
    val code: String? = null,
    val currencyCode: String? = null,
    val durationDays: Int? = null,
    val name: String? = null,
    val packageGroupId: String? = null,
    val planId: String? = null,
    val priceAmount: String? = null,
    val status: String? = null
)
