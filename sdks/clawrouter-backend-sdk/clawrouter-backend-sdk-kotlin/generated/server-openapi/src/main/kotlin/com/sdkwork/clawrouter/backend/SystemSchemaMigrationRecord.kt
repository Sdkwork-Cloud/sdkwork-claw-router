package com.sdkwork.clawrouter.backend

data class SystemSchemaMigrationRecord(
    val checksum: String? = null,
    val errorMessage: String? = null,
    val finishedAt: String? = null,
    val id: String? = null,
    val migrationKey: String? = null,
    val migrationVersion: String? = null,
    val startedAt: String? = null,
    val status: String? = null
)
