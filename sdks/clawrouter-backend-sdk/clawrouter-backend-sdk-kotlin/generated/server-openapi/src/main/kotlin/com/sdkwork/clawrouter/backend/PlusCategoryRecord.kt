package com.sdkwork.clawrouter.backend

data class PlusCategoryRecord(
    val code: String? = null,
    val createdAt: String? = null,
    val dataScope: Int? = null,
    val description: String? = null,
    val groupName: String? = null,
    val icon: MediaResource? = null,
    val id: String? = null,
    val name: String? = null,
    val organizationId: String? = null,
    val parentId: String? = null,
    val path: String? = null,
    val shopId: String? = null,
    val sortWeight: Int? = null,
    val status: Int? = null,
    val tags: Map<String, String>? = null,
    val tenantId: String? = null,
    val type: Int? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val v: String? = null,
    val visible: Boolean? = null
)
