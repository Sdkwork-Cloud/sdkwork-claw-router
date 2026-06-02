package com.sdkwork.clawrouter.backend

data class CommerceCategorySeedInitializeSummary(
    val configKey: String? = null,
    val dataset: String? = null,
    val installDefaultEnabled: Boolean? = null,
    val requested: Int? = null,
    val skipped: Int? = null,
    val targetTable: String? = null,
    val upserted: Int? = null
)
