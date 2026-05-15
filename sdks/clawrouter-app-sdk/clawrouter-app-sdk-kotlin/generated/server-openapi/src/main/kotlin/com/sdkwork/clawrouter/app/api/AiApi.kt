package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class AiApi(private val client: HttpClient) {

    /** List dashboard overview */
    suspend fun dashboardOverviewRetrieve(timeRange: String? = null, startTime: String? = null, endTime: String? = null): DashboardOverviewRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("time_range", timeRange, "form", true, false, null),
            QueryParameterSpec("start_time", startTime, "form", true, false, null),
            QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/dashboard/overview"), query))
        return client.convertValue(raw, object : TypeReference<DashboardOverviewRetrieveResult>() {})
    }

    /** List traces */
    suspend fun gatewayTracesList(): GatewayTracesListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/gateway/traces"))
        return client.convertValue(raw, object : TypeReference<GatewayTracesListResult>() {})
    }

    /** List generation history */
    suspend fun generationsList(): GenerationsListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/generations"))
        return client.convertValue(raw, object : TypeReference<GenerationsListResult>() {})
    }

    /** List model rankings */
    suspend fun modelRankingsList(rankScope: String? = null, vendorCode: String? = null, modality: String? = null, q: String? = null, limit: Int? = null): ModelRankingsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("rank_scope", rankScope, "form", true, false, null),
            QueryParameterSpec("vendor_code", vendorCode, "form", true, false, null),
            QueryParameterSpec("modality", modality, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/model_rankings"), query))
        return client.convertValue(raw, object : TypeReference<ModelRankingsListResult>() {})
    }

    /** List ranking vendor filters */
    suspend fun modelVendorsList(): ModelVendorsListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/model_vendors"))
        return client.convertValue(raw, object : TypeReference<ModelVendorsListResult>() {})
    }

    /** List models */
    suspend fun modelsList(billingMeter: String? = null, vendorCode: String? = null, vendorCodes: List<String>? = null, modalities: List<String>? = null, capabilities: List<String>? = null, categories: List<String>? = null, groups: List<String>? = null, q: String? = null, limit: Int? = null): ModelsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("billing_meter", billingMeter, "form", true, false, null),
            QueryParameterSpec("vendor_code", vendorCode, "form", true, false, null),
            QueryParameterSpec("vendor_codes", vendorCodes, "form", false, false, null),
            QueryParameterSpec("modalities", modalities, "form", false, false, null),
            QueryParameterSpec("capabilities", capabilities, "form", false, false, null),
            QueryParameterSpec("categories", categories, "form", false, false, null),
            QueryParameterSpec("groups", groups, "form", false, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/models"), query))
        return client.convertValue(raw, object : TypeReference<ModelsListResult>() {})
    }

    /** List providers */
    suspend fun providersList(): ProvidersListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/providers"))
        return client.convertValue(raw, object : TypeReference<ProvidersListResult>() {})
    }

    /** List API keys */
    suspend fun routingApiKeysList(): RoutingApiKeysListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/routing/api_keys"))
        return client.convertValue(raw, object : TypeReference<RoutingApiKeysListResult>() {})
    }

    /** List channels */
    suspend fun routingChannelsList(): RoutingChannelsListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/routing/channels"))
        return client.convertValue(raw, object : TypeReference<RoutingChannelsListResult>() {})
    }

    /** Create channel */
    suspend fun routingChannelsCreate(body: CreateRoutingChannelRequest, xRequestId: String? = null): RoutingChannelsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/ai/routing/channels"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RoutingChannelsCreateResult>() {})
    }

    /** Delete channel */
    suspend fun routingChannelsDelete(channelId: String): RoutingChannelsDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/ai/routing/channels/${serializePathParameter(channelId, PathParameterSpec("channelId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RoutingChannelsDeleteResult>() {})
    }

    /** Update channel */
    suspend fun routingChannelsUpdate(channelId: String, body: UpdateRoutingChannelRequest, xRequestId: String? = null): RoutingChannelsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.appPath("/ai/routing/channels/${serializePathParameter(channelId, PathParameterSpec("channelId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RoutingChannelsUpdateResult>() {})
    }

    /** Set channel status */
    suspend fun routingChannelsStatusUpdate(channelId: String, body: SetRoutingChannelStatusRequest, xRequestId: String? = null): RoutingChannelsStatusUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.appPath("/ai/routing/channels/${serializePathParameter(channelId, PathParameterSpec("channelId", "simple", false))}/status"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RoutingChannelsStatusUpdateResult>() {})
    }

    /** Test channel */
    suspend fun routingChannelsVerify(channelId: String, xRequestId: String? = null): RoutingChannelsVerifyResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/ai/routing/channels/${serializePathParameter(channelId, PathParameterSpec("channelId", "simple", false))}/verify"), null, null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<RoutingChannelsVerifyResult>() {})
    }

    /** List request traces */
    suspend fun routingRequestTracesList(): RoutingRequestTracesListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/routing/request_traces"))
        return client.convertValue(raw, object : TypeReference<RoutingRequestTracesListResult>() {})
    }

    /** List strategy */
    suspend fun routingStrategyList(): RoutingStrategyListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/routing/strategy"))
        return client.convertValue(raw, object : TypeReference<RoutingStrategyListResult>() {})
    }

    /** Update strategy */
    suspend fun routingStrategyUpdate(body: UpdateRoutingStrategyRequest): RoutingStrategyUpdateResult? {
        val raw = client.put(ApiPaths.appPath("/ai/routing/strategy"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<RoutingStrategyUpdateResult>() {})
    }

    /** List usage data */
    suspend fun routingUsageList(): RoutingUsageListResult? {
        val raw = client.get(ApiPaths.appPath("/ai/routing/usage"))
        return client.convertValue(raw, object : TypeReference<RoutingUsageListResult>() {})
    }

    /** List logs */
    suspend fun usageLogsList(page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null, startTime: String? = null, endTime: String? = null): UsageLogsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("start_time", startTime, "form", true, false, null),
            QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/ai/usage/logs"), query))
        return client.convertValue(raw, object : TypeReference<UsageLogsListResult>() {})
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
