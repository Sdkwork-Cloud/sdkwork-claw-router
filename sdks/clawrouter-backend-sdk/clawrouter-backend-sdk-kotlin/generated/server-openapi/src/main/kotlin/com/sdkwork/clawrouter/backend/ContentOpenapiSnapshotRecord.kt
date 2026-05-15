package com.sdkwork.clawrouter.backend

data class ContentOpenapiSnapshotRecord(
    val apiSurface: String? = null,
    val apiSystem: String? = null,
    val categoryTree: Map<String, String>? = null,
    val createdAt: String? = null,
    val endpointCount: Int? = null,
    val exampleManifest: Map<String, String>? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val openapiHash: String? = null,
    val organizationId: String? = null,
    val publishedAt: String? = null,
    val rebuildVersion: String? = null,
    val sourceId: String? = null,
    val sourceRef: String? = null,
    val sourceType: String? = null,
    val sourceVersion: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
