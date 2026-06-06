package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class OpenPlatformApi(private val client: HttpClient) {

    /** List open platform accounts */
    suspend fun accountsList(provider: String? = null, type: String? = null, status: String? = null, page: String? = null, pageSize: String? = null): AccountsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider", provider, "form", true, false, null),
            QueryParameterSpec("type", type, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/open_platform/accounts"), query))
        return client.convertValue(raw, object : TypeReference<AccountsListResult>() {})
    }

    /** Create open platform account */
    suspend fun accountsCreate(body: OpenPlatformAccountCreateRequest): AccountsCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/open_platform/accounts"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountsCreateResult>() {})
    }

    /** Delete open platform account */
    suspend fun accountsDelete(accountId: String): AccountsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AccountsDeleteResult>() {})
    }

    /** Retrieve open platform account */
    suspend fun accountsRetrieve(accountId: String): AccountsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AccountsRetrieveResult>() {})
    }

    /** Update open platform account */
    suspend fun accountsUpdate(accountId: String, body: OpenPlatformAccountUpdateRequest): AccountsUpdateResult? {
        val raw = client.patch(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountsUpdateResult>() {})
    }

    /** List open platform account entries */
    suspend fun accountsEntriesList(accountId: String): AccountsEntriesListResult? {
        val raw = client.get(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}/entries"))
        return client.convertValue(raw, object : TypeReference<AccountsEntriesListResult>() {})
    }

    /** Create open platform account entry */
    suspend fun accountsEntriesCreate(accountId: String, body: OpenPlatformEntryCreateRequest): AccountsEntriesCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}/entries"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountsEntriesCreateResult>() {})
    }

    /** Delete open platform account entry */
    suspend fun accountsEntriesDelete(accountId: String, entryId: String): AccountsEntriesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}/entries/${serializePathParameter(entryId, PathParameterSpec("entryId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AccountsEntriesDeleteResult>() {})
    }

    /** Update open platform account entry */
    suspend fun accountsEntriesUpdate(accountId: String, entryId: String, body: OpenPlatformEntryUpdateRequest): AccountsEntriesUpdateResult? {
        val raw = client.patch(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}/entries/${serializePathParameter(entryId, PathParameterSpec("entryId", "simple", false))}"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountsEntriesUpdateResult>() {})
    }

    /** List open platform account pay bindings */
    suspend fun accountsPayBindingsList(accountId: String): AccountsPayBindingsListResult? {
        val raw = client.get(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}/pay_bindings"))
        return client.convertValue(raw, object : TypeReference<AccountsPayBindingsListResult>() {})
    }

    /** Create open platform account pay binding */
    suspend fun accountsPayBindingsCreate(accountId: String, body: OpenPlatformPayBindingCreateRequest): AccountsPayBindingsCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}/pay_bindings"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountsPayBindingsCreateResult>() {})
    }

    /** Delete open platform account pay binding */
    suspend fun accountsPayBindingsDelete(accountId: String, bindingId: String): AccountsPayBindingsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/open_platform/accounts/${serializePathParameter(accountId, PathParameterSpec("accountId", "simple", false))}/pay_bindings/${serializePathParameter(bindingId, PathParameterSpec("bindingId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AccountsPayBindingsDeleteResult>() {})
    }

    /** List open platform manifests */
    suspend fun manifestsList(provider: String? = null, type: String? = null): ManifestsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider", provider, "form", true, false, null),
            QueryParameterSpec("type", type, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/open_platform/manifests"), query))
        return client.convertValue(raw, object : TypeReference<ManifestsListResult>() {})
    }

    /** List open platform providers */
    suspend fun providersList(status: String? = null): ProvidersListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/open_platform/providers"), query))
        return client.convertValue(raw, object : TypeReference<ProvidersListResult>() {})
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

}
