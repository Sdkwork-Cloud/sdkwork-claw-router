package com.sdkwork.clawrouter.backend

data class CommercePaymentRuntimeSnapshotResponse(
    val environment: String? = null,
    val events: List<CommercePaymentRuntimeAssemblyEvent>? = null,
    val recordedAt: String? = null,
    val summary: CommercePaymentRuntimeAssemblySummary? = null
)
