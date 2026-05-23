package com.sdkwork.clawrouter.app

data class MemorySpaceCreateRequest(
    val autoExtractEnabled: Boolean? = null,
    val autoRecallEnabled: Boolean? = null,
    val maxInjectedTokens: Int? = null,
    val memoryEnabled: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val ownerId: String? = null,
    val ownerType: String? = null,
    val retentionPolicy: Map<String, String>? = null,
    val reviewRequired: Boolean? = null,
    val sensitivityPolicy: Map<String, String>? = null,
    val spaceType: String? = null,
    val title: String? = null
)
