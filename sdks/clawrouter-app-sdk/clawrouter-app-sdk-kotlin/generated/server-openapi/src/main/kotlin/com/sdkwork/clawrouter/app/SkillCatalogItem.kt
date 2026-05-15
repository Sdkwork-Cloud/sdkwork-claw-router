package com.sdkwork.clawrouter.app

data class SkillCatalogItem(
    val category: String? = null,
    val clawhubImage: String? = null,
    val description: String? = null,
    val developer: String? = null,
    val downloads: String? = null,
    val features: List<String>? = null,
    val frameworks: List<String>? = null,
    val id: String? = null,
    val image: String? = null,
    val lastUpdated: String? = null,
    val license: String? = null,
    val name: String? = null,
    val packages: List<SkillPackageItem>? = null,
    val rating: Double? = null,
    val screenshots: List<String>? = null,
    val size: String? = null,
    val version: String? = null
)
