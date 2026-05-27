package com.sdkwork.clawrouter.backend

data class AdminPromptBindingItem(
    val bindingRole: String? = null,
    val createdAt: String? = null,
    val enabled: Boolean? = null,
    val id: Int? = null,
    val organizationId: Int? = null,
    val ownerId: Int? = null,
    val ownerType: String? = null,
    val policyJson: Map<String, String>? = null,
    val priority: Int? = null,
    val promptId: Int? = null,
    val promptVersionId: Int? = null,
    val snapshotJson: Map<String, String>? = null,
    val tenantId: Int? = null,
    val updatedAt: String? = null,
    val uuid: String? = null
)
