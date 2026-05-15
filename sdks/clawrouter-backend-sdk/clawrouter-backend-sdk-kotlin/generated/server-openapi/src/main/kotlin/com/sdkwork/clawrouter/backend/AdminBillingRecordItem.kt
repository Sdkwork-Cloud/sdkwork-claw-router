package com.sdkwork.clawrouter.backend

data class AdminBillingRecordItem(
    val dueDate: String? = null,
    val id: String? = null,
    val period: String? = null,
    val status: String? = null,
    val totalCost: String? = null,
    val totalTokens: Int? = null,
    val userId: String? = null
)
