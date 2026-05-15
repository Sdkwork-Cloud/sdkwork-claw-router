package com.sdkwork.clawrouter.app

data class AppInstalledSkillItem(
    val config: Map<String, String>? = null,
    val enabled: Boolean? = null,
    val id: String? = null,
    val installedAt: String? = null,
    val lastEnabledAt: String? = null,
    val skill: SkillCatalogItem? = null,
    val skillId: String? = null
)
