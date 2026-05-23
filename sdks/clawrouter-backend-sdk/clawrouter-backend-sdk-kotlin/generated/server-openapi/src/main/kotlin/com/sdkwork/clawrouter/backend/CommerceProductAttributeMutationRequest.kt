package com.sdkwork.clawrouter.backend

data class CommerceProductAttributeMutationRequest(
    val attributeNo: String? = null,
    val filterable: Boolean? = null,
    val name: String? = null,
    val required: Boolean? = null,
    val scope: String? = null,
    val searchable: Boolean? = null,
    val status: String? = null,
    val valueType: String? = null
)
