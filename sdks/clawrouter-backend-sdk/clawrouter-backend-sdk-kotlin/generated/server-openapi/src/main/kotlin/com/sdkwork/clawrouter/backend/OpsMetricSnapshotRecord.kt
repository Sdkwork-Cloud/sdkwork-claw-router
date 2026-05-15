package com.sdkwork.clawrouter.backend

data class OpsMetricSnapshotRecord(
    val createdAt: String? = null,
    val dimensionKey: String? = null,
    val dimensionValue: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val metricName: String? = null,
    val metricPeriod: String? = null,
    val metricScope: String? = null,
    val metricUnit: String? = null,
    val metricValue: String? = null,
    val organizationId: String? = null,
    val payload: Map<String, String>? = null,
    val periodEnd: String? = null,
    val periodStart: String? = null,
    val rebuildVersion: String? = null,
    val sourceId: String? = null,
    val sourceType: String? = null,
    val sourceVersion: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null
)
