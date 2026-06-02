package com.sdkwork.clawrouter.app

data class MessagingRouteRuleTargetRecord(
    val circuitBreakerPolicy: Map<String, String>? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val routeRuleId: String? = null,
    val senderIdentityId: String? = null,
    val status: String? = null,
    val targetOrder: Int? = null,
    val templateBindingId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null,
    val weight: Int? = null
)
