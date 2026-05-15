package com.sdkwork.clawrouter.app

data class SettlementDashboardResponse(
    val bills: List<SettlementBill>? = null,
    val chartData: List<SettlementChartPoint>? = null
)
