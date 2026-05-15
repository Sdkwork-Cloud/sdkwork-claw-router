package com.sdkwork.clawrouter.backend

data class AdminRecordLogsResponse(
    val logs: List<AdminRecordLogItem>? = null,
    val page: Int? = null,
    val pageSize: Int? = null,
    val total: Int? = null
)
