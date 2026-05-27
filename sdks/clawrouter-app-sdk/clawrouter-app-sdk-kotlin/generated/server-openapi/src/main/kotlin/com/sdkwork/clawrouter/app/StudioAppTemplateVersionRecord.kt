package com.sdkwork.clawrouter.app

data class StudioAppTemplateVersionRecord(
    val appConfigSchema: Map<String, String>? = null,
    val artifactId: String? = null,
    val capabilityManifest: Map<String, String>? = null,
    val changelog: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val defaultAppConfig: Map<String, String>? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val dependencyManifest: Map<String, String>? = null,
    val deprecatedAt: String? = null,
    val fileManifest: Map<String, String>? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val publishStatus: String? = null,
    val publishedAt: String? = null,
    val status: String? = null,
    val templateId: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val variableSchema: Map<String, String>? = null,
    val version: String? = null,
    val versionNo: String? = null
)
