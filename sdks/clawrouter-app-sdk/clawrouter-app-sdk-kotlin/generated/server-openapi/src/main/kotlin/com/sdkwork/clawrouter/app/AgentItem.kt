package com.sdkwork.clawrouter.app

data class AgentItem(
    val avatar: MediaResource? = null,
    val capabilities: AgentCapabilities? = null,
    val code: String? = null,
    val createdAt: String? = null,
    val defaultVersion: AgentVersionItem? = null,
    val description: String? = null,
    val id: String? = null,
    val name: String? = null,
    val ownerUserId: Int? = null,
    val status: String? = null,
    val templateSource: String? = null,
    val updatedAt: String? = null,
    val visibility: String? = null
)
