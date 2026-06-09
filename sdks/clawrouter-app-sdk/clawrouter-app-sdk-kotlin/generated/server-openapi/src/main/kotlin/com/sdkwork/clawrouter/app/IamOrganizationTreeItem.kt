package com.sdkwork.clawrouter.app

data class IamOrganizationTreeItem(
    val children: List<Map<String, String>>? = null,
    val code: String? = null,
    val createdAt: String? = null,
    val id: String? = null,
    val name: String? = null,
    val parentId: String? = null,
    val path: String? = null,
    val status: String? = null,
    val tenantId: String? = null,
    val updatedAt: String? = null
)
