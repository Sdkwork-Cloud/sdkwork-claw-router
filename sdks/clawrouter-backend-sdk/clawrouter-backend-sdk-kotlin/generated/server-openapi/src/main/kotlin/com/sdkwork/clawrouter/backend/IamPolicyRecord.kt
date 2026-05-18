package com.sdkwork.clawrouter.backend

data class IamPolicyRecord(
    val code: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val name: String? = null,
    val policyJson: Map<String, String>? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
