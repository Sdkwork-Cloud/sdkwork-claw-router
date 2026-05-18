package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class BillingApi(private val client: HttpClient) {

    /** List batches */
    suspend fun couponBatchesList(couponId: String? = null, status: String? = null, page: Int? = null, pageSize: Int? = null, cursor: String? = null): CouponBatchesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("coupon_id", couponId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupon_batches"), query))
        return client.convertValue(raw, object : TypeReference<CouponBatchesListResult>() {})
    }

    /** Generate batch */
    suspend fun couponBatchesCreate(body: AdminCouponBatchGenerateRequest, xRequestId: String? = null): CouponBatchesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/billing/coupon_batches"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponBatchesCreateResult>() {})
    }

    /** List promo codes */
    suspend fun couponCodesList(couponId: String? = null, batchId: String? = null, status: String? = null, page: Int? = null, pageSize: Int? = null, cursor: String? = null): CouponCodesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("coupon_id", couponId, "form", true, false, null),
            QueryParameterSpec("batch_id", batchId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupon_codes"), query))
        return client.convertValue(raw, object : TypeReference<CouponCodesListResult>() {})
    }

    /** Update promo code status */
    suspend fun couponCodesStatusUpdate(codeId: String, body: AdminPromoCodeStatusUpdateRequest, xRequestId: String? = null): CouponCodesStatusUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/billing/coupon_codes/${serializePathParameter(codeId, PathParameterSpec("codeId", "simple", false))}/status"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponCodesStatusUpdateResult>() {})
    }

    /** List coupons */
    suspend fun couponsList(status: String? = null, page: Int? = null, pageSize: Int? = null, cursor: String? = null): CouponsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/coupons"), query))
        return client.convertValue(raw, object : TypeReference<CouponsListResult>() {})
    }

    /** Create coupon */
    suspend fun couponsCreate(body: AdminCouponCreateRequest, xRequestId: String? = null): CouponsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/billing/coupons"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponsCreateResult>() {})
    }

    /** Delete coupon */
    suspend fun couponsDelete(couponId: String): CouponsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/billing/coupons/${serializePathParameter(couponId, PathParameterSpec("couponId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CouponsDeleteResult>() {})
    }

    /** Update coupon */
    suspend fun couponsUpdate(couponId: String, body: AdminCouponCreateRequest, xRequestId: String? = null): CouponsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/billing/coupons/${serializePathParameter(couponId, PathParameterSpec("couponId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponsUpdateResult>() {})
    }

    /** List exchange rules */
    suspend fun exchangeRulesList(sourceAssetType: String? = null, targetAssetType: String? = null, status: String? = null): ExchangeRulesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
            QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/exchange_rules"), query))
        return client.convertValue(raw, object : TypeReference<ExchangeRulesListResult>() {})
    }

    /** Upsert exchange rule */
    suspend fun exchangeRulesUpdate(body: CommerceExchangeRuleUpsertRequest, xRequestId: String? = null): ExchangeRulesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/billing/exchange_rules"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<ExchangeRulesUpdateResult>() {})
    }

    /** List transactions */
    suspend fun financeLedgerList(page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null, startTime: String? = null, endTime: String? = null): FinanceLedgerListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("start_time", startTime, "form", true, false, null),
            QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/finance/ledger"), query))
        return client.convertValue(raw, object : TypeReference<FinanceLedgerListResult>() {})
    }

    /** List billing */
    suspend fun financeUsageStatementsList(page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null, startTime: String? = null, endTime: String? = null): FinanceUsageStatementsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("start_time", startTime, "form", true, false, null),
            QueryParameterSpec("end_time", endTime, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/finance/usage_statements"), query))
        return client.convertValue(raw, object : TypeReference<FinanceUsageStatementsListResult>() {})
    }

    /** List payment attempts */
    suspend fun paymentsAttemptsList(provider: String? = null, status: String? = null, page: Int? = null, pageSize: Int? = null, cursor: String? = null): PaymentsAttemptsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("provider", provider, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/payments/attempts"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsAttemptsListResult>() {})
    }

    /** List recharge packages */
    suspend fun rechargesPackagesList(status: String? = null): RechargesPackagesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/recharges/packages"), query))
        return client.convertValue(raw, object : TypeReference<RechargesPackagesListResult>() {})
    }

    /** Create recharge package */
    suspend fun rechargesPackagesCreate(body: CommerceRechargePackageMutationRequest, xRequestId: String? = null): RechargesPackagesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/billing/recharges/packages"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RechargesPackagesCreateResult>() {})
    }

    /** Delete recharge package */
    suspend fun rechargesPackagesDelete(packageId: String): RechargesPackagesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/billing/recharges/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RechargesPackagesDeleteResult>() {})
    }

    /** Update recharge package */
    suspend fun rechargesPackagesUpdate(packageId: String, body: CommerceRechargePackageMutationRequest, xRequestId: String? = null): RechargesPackagesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/billing/recharges/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RechargesPackagesUpdateResult>() {})
    }

    /** List recharge records */
    suspend fun rechargesRecordsList(userId: String? = null, status: String? = null, page: Int? = null, pageSize: Int? = null, cursor: String? = null): RechargesRecordsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/recharges/records"), query))
        return client.convertValue(raw, object : TypeReference<RechargesRecordsListResult>() {})
    }

    /** Retrieve recharge record */
    suspend fun rechargesRecordsRetrieve(orderNo: String): RechargesRecordsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/billing/recharges/records/${serializePathParameter(orderNo, PathParameterSpec("orderNo", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RechargesRecordsRetrieveResult>() {})
    }

    /** List referral stats */
    suspend fun referralsStatsList(): ReferralsStatsListResult? {
        val raw = client.get(ApiPaths.backendPath("/billing/referrals/stats"))
        return client.convertValue(raw, object : TypeReference<ReferralsStatsListResult>() {})
    }

    /** List redemption records */
    suspend fun usersCouponsList(userId: String? = null, status: String? = null, page: Int? = null, pageSize: Int? = null, cursor: String? = null): UsersCouponsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("user_id", userId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/billing/users/coupons"), query))
        return client.convertValue(raw, object : TypeReference<UsersCouponsListResult>() {})
    }

    /** Update balance */
    suspend fun usersBalanceAdjustmentsCreate(userId: String, body: AdminUserBalanceAdjustmentRequest, xRequestId: String? = null): UsersBalanceAdjustmentsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/billing/users/${serializePathParameter(userId, PathParameterSpec("userId", "simple", false))}/balance_adjustments"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<UsersBalanceAdjustmentsCreateResult>() {})
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
