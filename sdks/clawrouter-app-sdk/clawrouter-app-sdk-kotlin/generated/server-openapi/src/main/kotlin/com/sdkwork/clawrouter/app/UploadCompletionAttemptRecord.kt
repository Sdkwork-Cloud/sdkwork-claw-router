package com.sdkwork.clawrouter.app

data class UploadCompletionAttemptRecord(
    val attemptNo: Int? = null,
    val completionStatus: String? = null,
    val createdAt: String? = null,
    val errorCode: String? = null,
    val errorMessageMasked: String? = null,
    val id: String? = null,
    val legalHold: Boolean? = null,
    val metadata: Map<String, String>? = null,
    val objectBlobId: String? = null,
    val organizationId: String? = null,
    val payloadHash: String? = null,
    val providerRequestId: String? = null,
    val requestId: String? = null,
    val retentionUntil: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val traceId: String? = null,
    val uploadSessionId: String? = null,
    val userId: String? = null,
    val uuid: String? = null
)
