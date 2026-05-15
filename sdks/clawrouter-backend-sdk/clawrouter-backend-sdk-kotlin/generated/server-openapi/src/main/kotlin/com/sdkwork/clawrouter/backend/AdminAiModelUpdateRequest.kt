package com.sdkwork.clawrouter.backend

data class AdminAiModelUpdateRequest(
    val apiFormat: String? = null,
    val capabilityIntro: String? = null,
    val contextTokens: String? = null,
    val description: String? = null,
    val inputModalities: List<String>? = null,
    val limitations: List<String>? = null,
    val maxOutputTokens: Int? = null,
    val modalities: List<String>? = null,
    val name: String? = null,
    val outputModalities: List<String>? = null,
    val priceIn: String? = null,
    val priceOut: String? = null,
    val releaseStage: Int? = null,
    val replacementModel: String? = null,
    val routingState: Int? = null,
    val shelfState: Int? = null,
    val status: String? = null,
    val supportedLanguages: List<String>? = null,
    val supportsJsonSchema: Boolean? = null,
    val supportsStreaming: Boolean? = null,
    val supportsTools: Boolean? = null,
    val trainingDataCutoff: String? = null,
    val type: String? = null,
    val useCases: List<String>? = null,
    val vendorId: String? = null
)
