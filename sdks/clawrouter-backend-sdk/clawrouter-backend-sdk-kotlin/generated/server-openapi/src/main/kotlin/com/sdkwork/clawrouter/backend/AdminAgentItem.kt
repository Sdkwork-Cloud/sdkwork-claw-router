package com.sdkwork.clawrouter.backend

data class AdminAgentItem(
    val avatarUrl: String? = null,
    val capabilities: AdminAgentCapabilities? = null,
    val code: String? = null,
    val createdAt: String? = null,
    val defaultVersion: AdminAgentVersionItem? = null,
    val description: String? = null,
    val id: String? = null,
    val name: String? = null,
    val ownerUserId: Int? = null,
    val status: String? = null,
    val templateSource: String? = null,
    val updatedAt: String? = null,
    val visibility: String? = null
)
