package com.sdkwork.clawrouter.backend

data class AdminModelCatalogSyncResponse(
    val acceptedCount: Int? = null,
    val capabilityCount: Int? = null,
    val catalogRoot: String? = null,
    val catalogVersion: String? = null,
    val dryRun: Boolean? = null,
    val familyCount: Int? = null,
    val meterCount: Int? = null,
    val mode: String? = null,
    val modelCount: Int? = null,
    val models: List<AdminAiModelItem>? = null,
    val priceCount: Int? = null,
    val rankingCount: Int? = null,
    val requestedCatalogVersion: String? = null,
    val snapshotId: String? = null,
    val source: String? = null,
    val sourceHash: String? = null,
    val syncRunId: String? = null,
    val synced: Boolean? = null,
    val vendorCodes: List<String>? = null,
    val vendorCount: Int? = null,
    val vendors: List<AdminModelVendorItem>? = null
)
