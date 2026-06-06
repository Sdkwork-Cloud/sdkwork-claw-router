package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class PlatformApi(private val client: HttpClient) {

    /** List apps */
    suspend fun appsList(q: String? = null, status: String? = null, marketStatus: String? = null, appType: String? = null, categoryId: String? = null, page: String? = null, pageSize: String? = null): AppsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("market_status", marketStatus, "form", true, false, null),
            QueryParameterSpec("app_type", appType, "form", true, false, null),
            QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/platform/apps"), query))
        return client.convertValue(raw, object : TypeReference<AppsListResult>() {})
    }

    /** Create app */
    suspend fun appsCreate(body: AdminAppCreateRequest): AppsCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AppsCreateResult>() {})
    }

    /** List app categories */
    suspend fun appsCategoriesList(): AppsCategoriesListResult? {
        val raw = client.get(ApiPaths.backendPath("/platform/apps/categories"))
        return client.convertValue(raw, object : TypeReference<AppsCategoriesListResult>() {})
    }

    /** Create app category */
    suspend fun appsCategoriesCreate(body: AdminAppCategoryCreateRequest): AppsCategoriesCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/categories"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AppsCategoriesCreateResult>() {})
    }

    /** Delete app category */
    suspend fun appsCategoriesDelete(categoryId: String): AppsCategoriesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/platform/apps/categories/${serializePathParameter(categoryId, PathParameterSpec("categoryId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AppsCategoriesDeleteResult>() {})
    }

    /** Update app category */
    suspend fun appsCategoriesUpdate(categoryId: String, body: AdminAppCategoryUpdateRequest): AppsCategoriesUpdateResult? {
        val raw = client.put(ApiPaths.backendPath("/platform/apps/categories/${serializePathParameter(categoryId, PathParameterSpec("categoryId", "simple", false))}"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AppsCategoriesUpdateResult>() {})
    }

    /** List app templates */
    suspend fun appsTemplatesList(q: String? = null, publishStatus: String? = null, templateType: String? = null, runtime: String? = null, categoryId: String? = null, page: String? = null, pageSize: String? = null): AppsTemplatesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("publish_status", publishStatus, "form", true, false, null),
            QueryParameterSpec("template_type", templateType, "form", true, false, null),
            QueryParameterSpec("runtime", runtime, "form", true, false, null),
            QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/platform/apps/templates"), query))
        return client.convertValue(raw, object : TypeReference<AppsTemplatesListResult>() {})
    }

    /** Create app template */
    suspend fun appsTemplatesCreate(body: AdminAppTemplateCreateRequest): AppsTemplatesCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/templates"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AppsTemplatesCreateResult>() {})
    }

    /** Delete app template */
    suspend fun appsTemplatesDelete(templateId: String): AppsTemplatesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/platform/apps/templates/${serializePathParameter(templateId, PathParameterSpec("templateId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AppsTemplatesDeleteResult>() {})
    }

    /** List app template */
    suspend fun appsTemplatesRetrieve(templateId: String): AppsTemplatesRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/platform/apps/templates/${serializePathParameter(templateId, PathParameterSpec("templateId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AppsTemplatesRetrieveResult>() {})
    }

    /** Update app template */
    suspend fun appsTemplatesUpdate(templateId: String, body: AdminAppTemplateUpdateRequest): AppsTemplatesUpdateResult? {
        val raw = client.put(ApiPaths.backendPath("/platform/apps/templates/${serializePathParameter(templateId, PathParameterSpec("templateId", "simple", false))}"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AppsTemplatesUpdateResult>() {})
    }

    /** Publish app template */
    suspend fun appsTemplatesPublish(templateId: String): AppsTemplatesPublishResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/templates/${serializePathParameter(templateId, PathParameterSpec("templateId", "simple", false))}/publish"), null)
        return client.convertValue(raw, object : TypeReference<AppsTemplatesPublishResult>() {})
    }

    /** Offline app template */
    suspend fun appsTemplatesUnpublish(templateId: String): AppsTemplatesUnpublishResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/templates/${serializePathParameter(templateId, PathParameterSpec("templateId", "simple", false))}/unpublish"), null)
        return client.convertValue(raw, object : TypeReference<AppsTemplatesUnpublishResult>() {})
    }

    /** Delete app */
    suspend fun appsDelete(appId: String): AppsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/platform/apps/${serializePathParameter(appId, PathParameterSpec("appId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AppsDeleteResult>() {})
    }

    /** List app */
    suspend fun appsRetrieve(appId: String): AppsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/platform/apps/${serializePathParameter(appId, PathParameterSpec("appId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AppsRetrieveResult>() {})
    }

    /** Update app */
    suspend fun appsUpdate(appId: String, body: AdminAppUpdateRequest): AppsUpdateResult? {
        val raw = client.put(ApiPaths.backendPath("/platform/apps/${serializePathParameter(appId, PathParameterSpec("appId", "simple", false))}"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<AppsUpdateResult>() {})
    }

    /** Disable app */
    suspend fun appsDisable(appId: String): AppsDisableResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/${serializePathParameter(appId, PathParameterSpec("appId", "simple", false))}/disable"), null)
        return client.convertValue(raw, object : TypeReference<AppsDisableResult>() {})
    }

    /** Enable app */
    suspend fun appsEnable(appId: String): AppsEnableResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/${serializePathParameter(appId, PathParameterSpec("appId", "simple", false))}/enable"), null)
        return client.convertValue(raw, object : TypeReference<AppsEnableResult>() {})
    }

    /** Publish app */
    suspend fun appsPublish(appId: String): AppsPublishResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/${serializePathParameter(appId, PathParameterSpec("appId", "simple", false))}/publish"), null)
        return client.convertValue(raw, object : TypeReference<AppsPublishResult>() {})
    }

    /** Offline app */
    suspend fun appsUnpublish(appId: String): AppsUnpublishResult? {
        val raw = client.post(ApiPaths.backendPath("/platform/apps/${serializePathParameter(appId, PathParameterSpec("appId", "simple", false))}/unpublish"), null)
        return client.convertValue(raw, object : TypeReference<AppsUnpublishResult>() {})
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
