package com.sdkwork.clawrouter.backend

data class AdminRecordLogItem(
    val baseInputPrice: String? = null,
    val baseOutputPrice: String? = null,
    val cacheReadPrice: String? = null,
    val cacheReadTokens: Int? = null,
    val cost: String? = null,
    val group: String? = null,
    val id: String? = null,
    val inputTokens: Int? = null,
    val ip: String? = null,
    val isStream: Boolean? = null,
    val model: String? = null,
    val multiplier: String? = null,
    val outputTokens: Int? = null,
    val path: String? = null,
    val reasoningEffort: String? = null,
    val requestId: String? = null,
    val time: String? = null,
    val tokenName: String? = null,
    val totalTime: String? = null,
    val ttft: String? = null,
    val type: String? = null,
    val user: String? = null
)
