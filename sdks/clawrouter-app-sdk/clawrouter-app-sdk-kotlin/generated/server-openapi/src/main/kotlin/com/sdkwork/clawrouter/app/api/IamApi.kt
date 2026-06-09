package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class IamApi(private val client: HttpClient) {

    /** List keys */
    suspend fun apiKeysList(): ApiKeysListResult? {
        val raw = client.get(ApiPaths.appPath("/iam/api_keys"))
        return client.convertValue(raw, object : TypeReference<ApiKeysListResult>() {})
    }

    /** Create key */
    suspend fun apiKeysCreate(body: CreateApiKeyRequest, idempotencyKey: String): ApiKeysCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/iam/api_keys"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<ApiKeysCreateResult>() {})
    }

    /** Delete key */
    suspend fun apiKeysDelete(apiKeyId: String): ApiKeysDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/iam/api_keys/${serializePathParameter(apiKeyId, PathParameterSpec("apiKeyId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<ApiKeysDeleteResult>() {})
    }

    /** Update key */
    suspend fun apiKeysUpdate(apiKeyId: String, body: UpdateApiKeyRequest): ApiKeysUpdateResult? {
        val raw = client.patch(ApiPaths.appPath("/iam/api_keys/${serializePathParameter(apiKeyId, PathParameterSpec("apiKeyId", "simple", false))}"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<ApiKeysUpdateResult>() {})
    }

    /** List current IAM department assignments */
    suspend fun departmentAssignmentsList(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): DepartmentAssignmentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/department_assignments"), query))
        return client.convertValue(raw, object : TypeReference<DepartmentAssignmentsListResult>() {})
    }

    /** List current IAM departments */
    suspend fun departmentsList(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): DepartmentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/departments"), query))
        return client.convertValue(raw, object : TypeReference<DepartmentsListResult>() {})
    }

    /** Retrieve current IAM department tree */
    suspend fun departmentsTreeRetrieve(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): DepartmentsTreeRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/departments/tree"), query))
        return client.convertValue(raw, object : TypeReference<DepartmentsTreeRetrieveResult>() {})
    }

    /** List current IAM organization memberships */
    suspend fun organizationMembershipsList(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): OrganizationMembershipsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/organization_memberships"), query))
        return client.convertValue(raw, object : TypeReference<OrganizationMembershipsListResult>() {})
    }

    /** List current IAM organizations */
    suspend fun organizationsList(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): OrganizationsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/organizations"), query))
        return client.convertValue(raw, object : TypeReference<OrganizationsListResult>() {})
    }

    /** Retrieve current IAM organization tree */
    suspend fun organizationsTreeRetrieve(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): OrganizationsTreeRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/organizations/tree"), query))
        return client.convertValue(raw, object : TypeReference<OrganizationsTreeRetrieveResult>() {})
    }

    /** List current IAM position assignments */
    suspend fun positionAssignmentsList(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): PositionAssignmentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/position_assignments"), query))
        return client.convertValue(raw, object : TypeReference<PositionAssignmentsListResult>() {})
    }

    /** List current IAM positions */
    suspend fun positionsList(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): PositionsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/positions"), query))
        return client.convertValue(raw, object : TypeReference<PositionsListResult>() {})
    }

    /** List current IAM role bindings */
    suspend fun roleBindingsList(organizationId: String? = null, departmentId: String? = null, userId: String? = null, scopeId: String? = null, status: String? = null, q: String? = null, page: Int? = null, pageSize: Int? = null): RoleBindingsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("organization_id", organizationId, "form", true, false, null),
            QueryParameterSpec("department_id", departmentId, "form", true, false, null),
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("scope_id", scopeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/iam/role_bindings"), query))
        return client.convertValue(raw, object : TypeReference<RoleBindingsListResult>() {})
    }

    /** Retrieve current IAM user */
    suspend fun usersCurrentRetrieve(): UsersCurrentRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/iam/users/current"))
        return client.convertValue(raw, object : TypeReference<UsersCurrentRetrieveResult>() {})
    }

    /** List settings */
    suspend fun usersSettingsRetrieve(): UsersSettingsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/iam/users/settings"))
        return client.convertValue(raw, object : TypeReference<UsersSettingsRetrieveResult>() {})
    }

    /** Update settings */
    suspend fun usersSettingsUpdate(body: UpdateSettingsRequest): UsersSettingsUpdateResult? {
        val raw = client.put(ApiPaths.appPath("/iam/users/settings"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<UsersSettingsUpdateResult>() {})
    }

    private data class PathParameterSpec(val name: String, val style: String, val explode: Boolean)

    private fun serializePathParameter(value: Any?, spec: PathParameterSpec): String {
        if (value == null) return ""
        val style = spec.style.ifBlank { "simple" }
        return when (value) {
            is Iterable<*> -> serializePathArray(spec.name, value, style, spec.explode)
            is Map<*, *> -> serializePathObject(spec.name, value, style, spec.explode)
            else -> pathPrimitivePrefix(spec.name, style) + pathEncode(value.toString())
        }
    }

    private fun serializePathArray(name: String, values: Iterable<*>, style: String, explode: Boolean): String {
        val serialized = values.mapNotNull { it?.toString()?.let(::pathEncode) }
        if (serialized.isEmpty()) return pathPrefix(name, style)
        if (style == "matrix") {
            if (explode) {
                return serialized.joinToString("") { ";$name=$it" }
            }
            return ";$name=" + serialized.joinToString(",")
        }
        val separator = if (explode) "." else ","
        return pathPrefix(name, style) + serialized.joinToString(separator)
    }

    private fun serializePathObject(name: String, values: Map<*, *>, style: String, explode: Boolean): String {
        val entries = mutableListOf<String>()
        val exploded = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            val escapedKey = pathEncode(key.toString())
            val escapedValue = pathEncode(value.toString())
            if (explode) {
                if (style == "matrix") {
                    exploded += ";$escapedKey=$escapedValue"
                } else {
                    exploded += "$escapedKey=$escapedValue"
                }
            } else {
                entries += escapedKey
                entries += escapedValue
            }
        }
        if (style == "matrix") {
            if (explode) return exploded.joinToString("")
            return ";$name=" + entries.joinToString(",")
        }
        if (explode) {
            val separator = if (style == "label") "." else ","
            return pathPrefix(name, style) + exploded.joinToString(separator)
        }
        return pathPrefix(name, style) + entries.joinToString(",")
    }

    private fun pathPrefix(name: String, style: String): String {
        return when (style) {
            "label" -> "."
            "matrix" -> ";$name"
            else -> ""
        }
    }

    private fun pathPrimitivePrefix(name: String, style: String): String {
        return if (style == "matrix") ";$name=" else pathPrefix(name, style)
    }

    private fun pathEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20")
    }

    private data class QueryParameterSpec(
        val name: String,
        val value: Any?,
        val style: String,
        val explode: Boolean,
        val allowReserved: Boolean,
        val contentType: String?,
    )

    private val queryObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildQueryString(parameters: List<QueryParameterSpec>): String {
        val pairs = mutableListOf<String>()
        parameters.forEach { appendSerializedParameter(pairs, it) }
        return pairs.joinToString("&")
    }

    private fun appendSerializedParameter(pairs: MutableList<String>, parameter: QueryParameterSpec) {
        val value = parameter.value ?: return
        if (!parameter.contentType.isNullOrBlank()) {
            val json = queryObjectMapper.writeValueAsString(value)
            pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(json, parameter.allowReserved)
            return
        }

        val style = parameter.style.ifBlank { "form" }
        when (value) {
            is Iterable<*> -> appendArrayParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            is Map<*, *> -> if (style == "deepObject") {
                appendDeepObjectParameter(pairs, parameter.name, value, parameter.allowReserved)
            } else {
                appendObjectParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            }
            else -> pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(value.toString(), parameter.allowReserved)
        }
    }

    private fun appendArrayParameter(
        pairs: MutableList<String>,
        name: String,
        values: Iterable<*>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = values.mapNotNull { it?.toString() }
        if (serialized.isEmpty()) return
        if (style == "form" && explode) {
            serialized.forEach { pairs += urlEncode(name) + "=" + encodeQueryValue(it, allowReserved) }
            return
        }
        pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
    }

    private fun appendObjectParameter(
        pairs: MutableList<String>,
        name: String,
        values: Map<*, *>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            if (style == "form" && explode) {
                pairs += urlEncode(key.toString()) + "=" + encodeQueryValue(value.toString(), allowReserved)
            } else {
                serialized += key.toString()
                serialized += value.toString()
            }
        }
        if (serialized.isNotEmpty()) {
            pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
        }
    }

    private fun appendDeepObjectParameter(pairs: MutableList<String>, name: String, values: Map<*, *>, allowReserved: Boolean) {
        values.forEach { (key, value) ->
            if (value != null) {
                pairs += urlEncode("$name[$key]") + "=" + encodeQueryValue(value.toString(), allowReserved)
            }
        }
    }

    private fun encodeQueryValue(value: String, allowReserved: Boolean): String {
        var encoded = urlEncode(value)
        if (!allowReserved) return encoded
        mapOf(
            "%3A" to ":", "%2F" to "/", "%3F" to "?", "%23" to "#",
            "%5B" to "[", "%5D" to "]", "%40" to "@", "%21" to "!",
            "%24" to "$", "%26" to "&", "%27" to "'", "%28" to "(",
            "%29" to ")", "%2A" to "*", "%2B" to "+", "%2C" to ",",
            "%3B" to ";", "%3D" to "=",
        ).forEach { (escaped, reserved) -> encoded = encoded.replace(escaped, reserved) }
        return encoded
    }

    private fun urlEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8)
    }

    private data class HeaderParameterSpec(val value: Any?, val style: String, val explode: Boolean, val contentType: String?)

    private val headerObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildRequestHeaders(headers: Map<String, HeaderParameterSpec>, cookies: Map<String, HeaderParameterSpec>): Map<String, String>? {
        val requestHeaders = linkedMapOf<String, String>()
        headers.forEach { (name, parameter) ->
            serializeParameterValue(parameter)?.let { requestHeaders[name] = it }
        }

        val cookieHeader = buildCookieHeader(cookies)
        if (cookieHeader.isNotEmpty()) {
            requestHeaders["Cookie"] = requestHeaders["Cookie"]?.let { "$it; $cookieHeader" } ?: cookieHeader
        }

        return requestHeaders.takeIf { it.isNotEmpty() }
    }

    private fun buildCookieHeader(cookies: Map<String, HeaderParameterSpec>): String {
        return cookies.mapNotNull { (name, parameter) ->
            serializeParameterValue(parameter)?.let {
                java.net.URLEncoder.encode(name, java.nio.charset.StandardCharsets.UTF_8) + "=" +
                    java.net.URLEncoder.encode(it, java.nio.charset.StandardCharsets.UTF_8)
            }
        }.joinToString("; ")
    }

    private fun serializeParameterValue(parameter: HeaderParameterSpec?): String? {
        val value = parameter?.value ?: return null
        if (!parameter.contentType.isNullOrBlank()) {
            return headerObjectMapper.writeValueAsString(value)
        }
        return when (value) {
            is Iterable<*> -> value.mapNotNull { it?.toString() }.joinToString(",")
            is Map<*, *> -> value.mapNotNull { (key, item) ->
                if (item == null) {
                    null
                } else if (parameter.explode) {
                    "$key=$item"
                } else {
                    listOf(key.toString(), item.toString()).joinToString(",")
                }
            }.joinToString(",")
            else -> value.toString()
        }
    }
}
