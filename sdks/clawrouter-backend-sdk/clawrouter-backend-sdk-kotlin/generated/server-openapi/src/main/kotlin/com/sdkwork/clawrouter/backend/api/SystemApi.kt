package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class SystemApi(private val client: HttpClient) {

    /** List overview */
    suspend fun analyticsAdminOverviewRetrieve(timeRange: String? = null, startTime: String? = null, endTime: String? = null, limit: Int? = null): AnalyticsAdminOverviewRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("time_range", timeRange, "form", true, false, null),
            QueryParameterSpec("start_time", startTime, "form", true, false, null),
            QueryParameterSpec("end_time", endTime, "form", true, false, null),
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/system/analytics/admin/overview"), query))
        return client.convertValue(raw, object : TypeReference<AnalyticsAdminOverviewRetrieveResult>() {})
    }

    /** Retrieve IAM auth runtime settings */
    suspend fun authSettingsRetrieve(): AuthSettingsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/system/auth/settings"))
        return client.convertValue(raw, object : TypeReference<AuthSettingsRetrieveResult>() {})
    }

    /** Update IAM auth runtime settings */
    suspend fun authSettingsUpdate(body: AdminAuthSettingsUpdateRequest, xRequestId: String? = null): AuthSettingsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/system/auth/settings"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AuthSettingsUpdateResult>() {})
    }

    /** Delete one runtime cache instance */
    suspend fun cacheInstancesDelete(instanceName: String): CacheInstancesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/system/cache/instances/${serializePathParameter(instanceName, PathParameterSpec("instanceName", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CacheInstancesDeleteResult>() {})
    }

    /** Refresh one runtime cache instance */
    suspend fun cacheInstancesRefreshCreate(instanceName: String): CacheInstancesRefreshCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/system/cache/instances/${serializePathParameter(instanceName, PathParameterSpec("instanceName", "simple", false))}/refresh"), null)
        return client.convertValue(raw, object : TypeReference<CacheInstancesRefreshCreateResult>() {})
    }

    /** Delete a runtime cache namespace */
    suspend fun cacheNamespacesDelete(namespace: String): CacheNamespacesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/system/cache/namespaces/${serializePathParameter(namespace, PathParameterSpec("namespace", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CacheNamespacesDeleteResult>() {})
    }

    /** List runtime cache keys in a namespace */
    suspend fun cacheNamespacesKeysList(namespace: String, limit: Int? = null, cursor: String? = null): CacheNamespacesKeysListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("limit", limit, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/system/cache/namespaces/${serializePathParameter(namespace, PathParameterSpec("namespace", "simple", false))}/keys"), query))
        return client.convertValue(raw, object : TypeReference<CacheNamespacesKeysListResult>() {})
    }

    /** Delete a runtime cache key */
    suspend fun cacheNamespacesKeysDelete(namespace: String, key: String): CacheNamespacesKeysDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/system/cache/namespaces/${serializePathParameter(namespace, PathParameterSpec("namespace", "simple", false))}/keys/${serializePathParameter(key, PathParameterSpec("key", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CacheNamespacesKeysDeleteResult>() {})
    }

    /** Refresh one runtime cache namespace */
    suspend fun cacheNamespacesRefreshCreate(namespace: String): CacheNamespacesRefreshCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/system/cache/namespaces/${serializePathParameter(namespace, PathParameterSpec("namespace", "simple", false))}/refresh"), null)
        return client.convertValue(raw, object : TypeReference<CacheNamespacesRefreshCreateResult>() {})
    }

    /** Retrieve runtime cache overview */
    suspend fun cacheOverviewRetrieve(): CacheOverviewRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/system/cache/overview"))
        return client.convertValue(raw, object : TypeReference<CacheOverviewRetrieveResult>() {})
    }

    /** Refresh all runtime cache instances */
    suspend fun cacheRefreshCreate(): CacheRefreshCreateResult? {
        val raw = client.post(ApiPaths.backendPath("/system/cache/refresh"), null)
        return client.convertValue(raw, object : TypeReference<CacheRefreshCreateResult>() {})
    }

    /** List dashboard data */
    suspend fun dashboardAdminOverviewRetrieve(): DashboardAdminOverviewRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/system/dashboard/admin/overview"))
        return client.convertValue(raw, object : TypeReference<DashboardAdminOverviewRetrieveResult>() {})
    }

    /** List firewalls */
    suspend fun firewallsRulesList(): FirewallsRulesListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/firewalls/rules"))
        return client.convertValue(raw, object : TypeReference<FirewallsRulesListResult>() {})
    }

    /** Create firewall */
    suspend fun firewallsRulesCreate(body: AdminFirewallRuleCreateRequest, xRequestId: String? = null): FirewallsRulesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/system/firewalls/rules"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<FirewallsRulesCreateResult>() {})
    }

    /** Delete firewall */
    suspend fun firewallsRulesDelete(ruleId: String): FirewallsRulesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/system/firewalls/rules/${serializePathParameter(ruleId, PathParameterSpec("ruleId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<FirewallsRulesDeleteResult>() {})
    }

    /** List installation status */
    suspend fun installationStatusRetrieve(): InstallationStatusRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/system/installation/status"))
        return client.convertValue(raw, object : TypeReference<InstallationStatusRetrieveResult>() {})
    }

    /** List referral stats */
    suspend fun marketingReferralStatsList(): MarketingReferralStatsListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/marketing/referral_stats"))
        return client.convertValue(raw, object : TypeReference<MarketingReferralStatsListResult>() {})
    }

    /** List alerts */
    suspend fun monitorAlertsList(): MonitorAlertsListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/monitor/alerts"))
        return client.convertValue(raw, object : TypeReference<MonitorAlertsListResult>() {})
    }

    /** List nodes */
    suspend fun monitorNodesList(): MonitorNodesListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/monitor/nodes"))
        return client.convertValue(raw, object : TypeReference<MonitorNodesListResult>() {})
    }

    /** List performance data */
    suspend fun monitorPerformanceList(): MonitorPerformanceListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/monitor/performance"))
        return client.convertValue(raw, object : TypeReference<MonitorPerformanceListResult>() {})
    }

    /** List token limits */
    suspend fun rateLimitsApiKeysList(): RateLimitsApiKeysListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/rate_limits/api_keys"))
        return client.convertValue(raw, object : TypeReference<RateLimitsApiKeysListResult>() {})
    }

    /** Create token limit */
    suspend fun rateLimitsApiKeysCreate(body: AdminTokenLimitCreateRequest, xRequestId: String? = null): RateLimitsApiKeysCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/system/rate_limits/api_keys"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RateLimitsApiKeysCreateResult>() {})
    }

    /** List IP limits */
    suspend fun rateLimitsIpList(): RateLimitsIpListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/rate_limits/ip"))
        return client.convertValue(raw, object : TypeReference<RateLimitsIpListResult>() {})
    }

    /** Create IP limit */
    suspend fun rateLimitsIpCreate(body: AdminIpLimitCreateRequest, xRequestId: String? = null): RateLimitsIpCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/system/rate_limits/ip"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RateLimitsIpCreateResult>() {})
    }

    /** List model limits */
    suspend fun rateLimitsModelsList(): RateLimitsModelsListResult? {
        val raw = client.get(ApiPaths.backendPath("/system/rate_limits/models"))
        return client.convertValue(raw, object : TypeReference<RateLimitsModelsListResult>() {})
    }

    /** Create model limit */
    suspend fun rateLimitsModelsCreate(body: AdminModelLimitCreateRequest, xRequestId: String? = null): RateLimitsModelsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/system/rate_limits/models"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RateLimitsModelsCreateResult>() {})
    }

    /** List logs */
    suspend fun recordsList(page: Int? = null, pageSize: Int? = null, user: String? = null, token: String? = null, model: String? = null): RecordsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("user", user, "form", true, false, null),
            QueryParameterSpec("token", token, "form", true, false, null),
            QueryParameterSpec("model", model, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/system/records"), query))
        return client.convertValue(raw, object : TypeReference<RecordsListResult>() {})
    }

    /** Retrieve site branding and deployment personalization settings */
    suspend fun siteSettingsRetrieve(): SiteSettingsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/system/site/settings"))
        return client.convertValue(raw, object : TypeReference<SiteSettingsRetrieveResult>() {})
    }

    /** Update site branding and deployment personalization settings */
    suspend fun siteSettingsUpdate(body: AdminSiteSettingsUpdateRequest, xRequestId: String? = null): SiteSettingsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/system/site/settings"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<SiteSettingsUpdateResult>() {})
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
