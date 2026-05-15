package com.sdkwork.clawrouter.app

data class SystemInstallationStateRecord(
    val catalogVersion: String? = null,
    val databaseEngine: String? = null,
    val environment: String? = null,
    val id: String? = null,
    val installationId: String? = null,
    val installedAt: String? = null,
    val lastCheckedAt: String? = null,
    val metadata: Map<String, String>? = null,
    val schemaVersion: String? = null,
    val seedProfile: String? = null,
    val status: String? = null,
    val upgradedAt: String? = null
)
