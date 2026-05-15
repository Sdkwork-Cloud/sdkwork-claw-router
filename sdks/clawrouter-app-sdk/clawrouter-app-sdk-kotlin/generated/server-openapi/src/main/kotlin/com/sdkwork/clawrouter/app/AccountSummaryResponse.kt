package com.sdkwork.clawrouter.app

data class AccountSummaryResponse(
    val availableCredits: Double? = null,
    val consumptionByService: List<AccountConsumptionItem>? = null,
    val email: String? = null,
    val estDaysRemaining: Int? = null,
    val id: String? = null,
    val invoiceSettings: AccountInvoiceSettings? = null,
    val isVerified: Boolean? = null,
    val loginLogs: List<AccountLoginLog>? = null,
    val monthlyConsumption: Double? = null,
    val name: String? = null,
    val organization: String? = null,
    val security: AccountSecuritySummary? = null,
    val tier: String? = null
)
