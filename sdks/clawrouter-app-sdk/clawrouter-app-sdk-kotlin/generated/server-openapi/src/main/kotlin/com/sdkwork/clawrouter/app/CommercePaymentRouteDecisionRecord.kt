package com.sdkwork.clawrouter.app

data class CommercePaymentRouteDecisionRecord(
    val amount: String? = null,
    val channelId: String? = null,
    val countryCode: String? = null,
    val createdAt: String? = null,
    val currencyCode: String? = null,
    val decisionReason: String? = null,
    val fallbackFromChannelId: String? = null,
    val id: String? = null,
    val methodCode: String? = null,
    val organizationId: String? = null,
    val paymentAttemptId: String? = null,
    val paymentIntentId: String? = null,
    val providerAccountId: String? = null,
    val providerCode: String? = null,
    val riskLevel: String? = null,
    val routeRuleId: String? = null,
    val sceneCode: String? = null,
    val tenantId: String? = null
)
