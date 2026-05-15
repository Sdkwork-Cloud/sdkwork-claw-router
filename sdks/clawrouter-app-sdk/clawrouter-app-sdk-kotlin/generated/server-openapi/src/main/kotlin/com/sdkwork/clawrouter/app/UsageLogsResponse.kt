package com.sdkwork.clawrouter.app

data class UsageLogsResponse(
    val logs: List<UsageLogItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
