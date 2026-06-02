package com.sdkwork.clawrouter.backend

data class AdminSkillPackageUpdateRequest(
    val categoryId: String? = null,
    val cover: MediaResource? = null,
    val description: String? = null,
    val enabled: Boolean? = null,
    val featured: Boolean? = null,
    val icon: MediaResource? = null,
    val name: String? = null,
    val packageKey: String? = null,
    val sortWeight: Int? = null,
    val summary: String? = null,
    val tags: List<String>? = null
)
