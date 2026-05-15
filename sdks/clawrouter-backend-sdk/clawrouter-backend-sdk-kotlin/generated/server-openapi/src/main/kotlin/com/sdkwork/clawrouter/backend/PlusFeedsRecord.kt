package com.sdkwork.clawrouter.backend

data class PlusFeedsRecord(
    val author: Map<String, String>? = null,
    val coverImages: Map<String, String>? = null,
    val publishTime: String? = null,
    val resourceList: Map<String, String>? = null,
    val source: String? = null,
    val sourceUrl: String? = null,
    val summary: String? = null,
    val tags: Map<String, String>? = null,
    val userId: String? = null
)
