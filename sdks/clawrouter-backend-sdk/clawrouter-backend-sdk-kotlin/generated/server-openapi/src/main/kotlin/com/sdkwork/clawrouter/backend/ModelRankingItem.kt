package com.sdkwork.clawrouter.backend

data class ModelRankingItem(
    val baseVolume: Int? = null,
    val color: String? = null,
    val contextSize: String? = null,
    val cost: Double? = null,
    val costIndicator: Int? = null,
    val currency: String? = null,
    val id: String? = null,
    val isNew: Boolean? = null,
    val latency: Int? = null,
    val license: String? = null,
    val modality: String? = null,
    val name: String? = null,
    val prevRank: Int? = null,
    val pricing: String? = null,
    val rank: Int? = null,
    val requests: Int? = null,
    val strengths: List<String>? = null,
    val tokens: Int? = null,
    val trendScore: Double? = null,
    val vendor: String? = null,
    val vendorCode: String? = null,
    val winRate: Double? = null
)
