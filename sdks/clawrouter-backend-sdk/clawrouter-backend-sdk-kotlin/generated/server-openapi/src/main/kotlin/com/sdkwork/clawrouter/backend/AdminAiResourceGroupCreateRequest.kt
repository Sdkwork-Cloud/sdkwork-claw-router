package com.sdkwork.clawrouter.backend

data class AdminAiResourceGroupCreateRequest(
    val description: String? = null,
    val groupCode: String? = null,
    val groupName: String? = null,
    val groupType: String? = null,
    val members: List<AdminAiResourceGroupMemberInput>? = null,
    val selectionMode: String? = null,
    val sortOrder: Int? = null,
    val status: String? = null
)
