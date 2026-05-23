package com.sdkwork.clawrouter.backend

data class CommerceMembershipBenefitMutationRequest(
    val benefitKey: String? = null,
    val claimed: Boolean? = null,
    val description: String? = null,
    val icon: String? = null,
    val id: Int? = null,
    val name: String? = null,
    val type: String? = null,
    val usageLimit: Int? = null,
    val usedCount: Int? = null
)
