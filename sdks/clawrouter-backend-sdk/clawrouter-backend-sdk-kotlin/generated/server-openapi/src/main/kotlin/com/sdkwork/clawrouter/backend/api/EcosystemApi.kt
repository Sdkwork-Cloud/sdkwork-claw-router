package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class EcosystemApi(private val client: HttpClient) {

    /** List skills */
    suspend fun skillsList(q: String? = null, marketStatus: String? = null, reviewStatus: String? = null, visibility: String? = null, enabled: Boolean? = null, categoryId: String? = null, page: Int? = null, pageSize: Int? = null): SkillsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("market_status", marketStatus, "form", true, false, null),
            QueryParameterSpec("review_status", reviewStatus, "form", true, false, null),
            QueryParameterSpec("visibility", visibility, "form", true, false, null),
            QueryParameterSpec("enabled", enabled, "form", true, false, null),
            QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/ecosystem/skills"), query))
        return client.convertValue(raw, object : TypeReference<SkillsListResult>() {})
    }

    /** Create skill */
    suspend fun skillsCreate(body: AdminSkillCreateRequest, xRequestId: String? = null): SkillsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsCreateResult>() {})
    }

    /** List skill categories */
    suspend fun skillsCategoriesList(): SkillsCategoriesListResult? {
        val raw = client.get(ApiPaths.backendPath("/ecosystem/skills/categories"))
        return client.convertValue(raw, object : TypeReference<SkillsCategoriesListResult>() {})
    }

    /** Create skill category */
    suspend fun skillsCategoriesCreate(body: AdminSkillCategoryCreateRequest, xRequestId: String? = null): SkillsCategoriesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/categories"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsCategoriesCreateResult>() {})
    }

    /** List skill packages */
    suspend fun skillsPackageList(q: String? = null, enabled: Boolean? = null, categoryId: String? = null, page: Int? = null, pageSize: Int? = null): SkillsPackageListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("enabled", enabled, "form", true, false, null),
            QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/ecosystem/skills/package"), query))
        return client.convertValue(raw, object : TypeReference<SkillsPackageListResult>() {})
    }

    /** Create skill package */
    suspend fun skillsPackageCreate(body: AdminSkillPackageCreateRequest, xRequestId: String? = null): SkillsPackageCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/package"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsPackageCreateResult>() {})
    }

    /** Delete skill package */
    suspend fun skillsPackageDelete(packageId: String): SkillsPackageDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/ecosystem/skills/package/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<SkillsPackageDeleteResult>() {})
    }

    /** Get skill package */
    suspend fun skillsPackageRetrieve(packageId: String): SkillsPackageRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/ecosystem/skills/package/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<SkillsPackageRetrieveResult>() {})
    }

    /** Update skill package */
    suspend fun skillsPackageUpdate(packageId: String, body: AdminSkillPackageUpdateRequest, xRequestId: String? = null): SkillsPackageUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/ecosystem/skills/package/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsPackageUpdateResult>() {})
    }

    /** Disable skill package */
    suspend fun skillsPackageDisable(packageId: String, xRequestId: String? = null): SkillsPackageDisableResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/package/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}/disable"), null, null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsPackageDisableResult>() {})
    }

    /** Enable skill package */
    suspend fun skillsPackageEnable(packageId: String, xRequestId: String? = null): SkillsPackageEnableResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/package/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}/enable"), null, null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsPackageEnableResult>() {})
    }

    /** Delete skill */
    suspend fun skillsDelete(skillId: String): SkillsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<SkillsDeleteResult>() {})
    }

    /** Get skill */
    suspend fun skillsRetrieve(skillId: String): SkillsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<SkillsRetrieveResult>() {})
    }

    /** Update skill */
    suspend fun skillsUpdate(skillId: String, body: AdminSkillUpdateRequest, xRequestId: String? = null): SkillsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsUpdateResult>() {})
    }

    /** List skill artifacts */
    suspend fun skillsArtifactsList(skillId: String): SkillsArtifactsListResult? {
        val raw = client.get(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/artifacts"))
        return client.convertValue(raw, object : TypeReference<SkillsArtifactsListResult>() {})
    }

    /** Create skill artifact */
    suspend fun skillsArtifactsCreate(skillId: String, body: AdminSkillArtifactCreateRequest, xRequestId: String? = null): SkillsArtifactsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/artifacts"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsArtifactsCreateResult>() {})
    }

    /** Delete skill artifact */
    suspend fun skillsArtifactsDelete(skillId: String, artifactId: String, xRequestId: String? = null): SkillsArtifactsDeleteResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.delete(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/artifacts/${serializePathParameter(artifactId, PathParameterSpec("artifactId", "simple", false))}"), null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsArtifactsDeleteResult>() {})
    }

    /** Get skill artifact */
    suspend fun skillsArtifactsRetrieve(skillId: String, artifactId: String): SkillsArtifactsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/artifacts/${serializePathParameter(artifactId, PathParameterSpec("artifactId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<SkillsArtifactsRetrieveResult>() {})
    }

    /** Update skill artifact */
    suspend fun skillsArtifactsUpdate(skillId: String, artifactId: String, body: AdminSkillArtifactUpdateRequest, xRequestId: String? = null): SkillsArtifactsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/artifacts/${serializePathParameter(artifactId, PathParameterSpec("artifactId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsArtifactsUpdateResult>() {})
    }

    /** List skill assets */
    suspend fun skillsAssetsList(skillId: String): SkillsAssetsListResult? {
        val raw = client.get(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/assets"))
        return client.convertValue(raw, object : TypeReference<SkillsAssetsListResult>() {})
    }

    /** Create skill asset */
    suspend fun skillsAssetsCreate(skillId: String, body: AdminSkillAssetCreateRequest, xRequestId: String? = null): SkillsAssetsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/assets"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsAssetsCreateResult>() {})
    }

    /** Delete skill asset */
    suspend fun skillsAssetsDelete(skillId: String, assetId: String, xRequestId: String? = null): SkillsAssetsDeleteResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.delete(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/assets/${serializePathParameter(assetId, PathParameterSpec("assetId", "simple", false))}"), null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsAssetsDeleteResult>() {})
    }

    /** Get skill asset */
    suspend fun skillsAssetsRetrieve(skillId: String, assetId: String): SkillsAssetsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/assets/${serializePathParameter(assetId, PathParameterSpec("assetId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<SkillsAssetsRetrieveResult>() {})
    }

    /** Update skill asset */
    suspend fun skillsAssetsUpdate(skillId: String, assetId: String, body: AdminSkillAssetUpdateRequest, xRequestId: String? = null): SkillsAssetsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/assets/${serializePathParameter(assetId, PathParameterSpec("assetId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsAssetsUpdateResult>() {})
    }

    /** Disable skill */
    suspend fun skillsDisable(skillId: String, xRequestId: String? = null): SkillsDisableResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/disable"), null, null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsDisableResult>() {})
    }

    /** Enable skill */
    suspend fun skillsEnable(skillId: String, xRequestId: String? = null): SkillsEnableResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/enable"), null, null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsEnableResult>() {})
    }

    /** Publish skill */
    suspend fun skillsPublish(skillId: String, xRequestId: String? = null): SkillsPublishResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/publish"), null, null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsPublishResult>() {})
    }

    /** Approve skill */
    suspend fun skillsReviewApprove(skillId: String, body: AdminSkillReviewRequest, xRequestId: String? = null): SkillsReviewApproveResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/review/approve"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsReviewApproveResult>() {})
    }

    /** Reject skill */
    suspend fun skillsReviewReject(skillId: String, body: AdminSkillReviewRequest, xRequestId: String? = null): SkillsReviewRejectResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/review/reject"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SkillsReviewRejectResult>() {})
    }

    /** Offline skill */
    suspend fun skillsUnpublish(skillId: String, xRequestId: String? = null): SkillsUnpublishResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/ecosystem/skills/${serializePathParameter(skillId, PathParameterSpec("skillId", "simple", false))}/unpublish"), null, null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<SkillsUnpublishResult>() {})
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
