package com.sdkwork.clawrouter.backend

data class CommerceMembershipPackageGroupMutationRequest(
    val billingCycle: String? = null,
    val code: String? = null,
    val description: String? = null,
    val durationDays: Int? = null,
    val name: String? = null,
    val sortWeight: Int? = null,
    val status: String? = null
)
