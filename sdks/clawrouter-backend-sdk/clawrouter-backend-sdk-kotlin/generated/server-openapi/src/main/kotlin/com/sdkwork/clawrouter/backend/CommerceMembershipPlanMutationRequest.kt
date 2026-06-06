package com.sdkwork.clawrouter.backend

data class CommerceMembershipPlanMutationRequest(
    val benefits: List<CommerceMembershipBenefitMutationRequest>? = null,
    val code: String? = null,
    val name: String? = null,
    val rank: String? = null,
    val status: String? = null
)
