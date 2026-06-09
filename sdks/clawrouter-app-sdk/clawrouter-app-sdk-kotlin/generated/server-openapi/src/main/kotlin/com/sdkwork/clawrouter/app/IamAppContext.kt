package com.sdkwork.clawrouter.app

data class IamAppContext(
    val appId: String? = null,
    val authLevel: String? = null,
    val dataScope: List<String>? = null,
    val deploymentMode: String? = null,
    val environment: String? = null,
    val organizationId: String? = null,
    val permissionScope: List<String>? = null,
    val sessionId: String? = null,
    val tenantId: String? = null,
    val userId: String? = null
)
