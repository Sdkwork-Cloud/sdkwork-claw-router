package com.sdkwork.clawrouter.app

data class SettlementBill(
    val breakdown: SettlementBillBreakdown? = null,
    val endDate: String? = null,
    val id: String? = null,
    val period: String? = null,
    val startDate: String? = null,
    val status: String? = null,
    val totalCost: String? = null,
    val totalTokens: String? = null
)
