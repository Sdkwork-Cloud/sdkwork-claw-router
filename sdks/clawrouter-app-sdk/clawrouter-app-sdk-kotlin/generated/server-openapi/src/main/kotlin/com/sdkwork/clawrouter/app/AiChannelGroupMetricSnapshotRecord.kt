package com.sdkwork.clawrouter.app

data class AiChannelGroupMetricSnapshotRecord(
    val capacityLimit: String? = null,
    val capacityUsed: String? = null,
    val channelAvailableCount: String? = null,
    val channelGroupId: String? = null,
    val channelTotalCount: String? = null,
    val createdAt: String? = null,
    val groupCode: String? = null,
    val healthStatus: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val providerCode: String? = null,
    val rebuildVersion: String? = null,
    val requestCountToday: String? = null,
    val requestCountTotal: String? = null,
    val snapshotAt: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val sourceVersion: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val usageAmountToday: String? = null,
    val usageAmountTotal: String? = null,
    val uuid: String? = null
)
