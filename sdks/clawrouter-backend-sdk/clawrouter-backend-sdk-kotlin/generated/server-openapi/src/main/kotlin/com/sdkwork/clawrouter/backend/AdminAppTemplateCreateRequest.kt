package com.sdkwork.clawrouter.backend

data class AdminAppTemplateCreateRequest(
    val appConfigSchema: Map<String, String>? = null,
    val capabilityManifest: List<Map<String, String>>? = null,
    val categoryCode: String? = null,
    val categoryId: String? = null,
    val coverUrl: String? = null,
    val defaultAppConfig: Map<String, String>? = null,
    val dependencyManifest: List<Map<String, String>>? = null,
    val description: String? = null,
    val featured: Boolean? = null,
    val framework: String? = null,
    val gitRef: String? = null,
    val gitRepoUrl: String? = null,
    val gitSubPath: String? = null,
    val iconUrl: String? = null,
    val language: String? = null,
    val publishStatus: String? = null,
    val runtime: String? = null,
    val sortWeight: Int? = null,
    val sourceAppId: String? = null,
    val templateCode: String? = null,
    val templateName: String? = null,
    val templateNo: String? = null,
    val templateType: String? = null,
    val variableSchema: Map<String, String>? = null,
    val visibility: String? = null
)
