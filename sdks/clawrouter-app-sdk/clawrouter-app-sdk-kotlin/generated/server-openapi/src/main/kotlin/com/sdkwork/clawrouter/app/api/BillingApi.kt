package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class BillingApi(private val client: HttpClient) {

    /** Retrieve account points */
    suspend fun accountPointsRetrieve(): AccountPointsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/account/points"))
        return client.convertValue(raw, object : TypeReference<AccountPointsRetrieveResult>() {})
    }

    /** Retrieve account points exchange rate */
    suspend fun accountPointsExchangeRateRetrieve(): AccountPointsExchangeRateRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/account/points/exchange_rate"))
        return client.convertValue(raw, object : TypeReference<AccountPointsExchangeRateRetrieveResult>() {})
    }

    /** Create account points exchange */
    suspend fun accountPointsExchangesCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = null): AccountPointsExchangesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/account/points/exchanges"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountPointsExchangesCreateResult>() {})
    }

    /** List account points exchange rules */
    suspend fun accountPointsExchangesRulesList(sourceAssetType: String? = null, targetAssetType: String? = null): AccountPointsExchangesRulesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
            QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/exchanges/rules"), query))
        return client.convertValue(raw, object : TypeReference<AccountPointsExchangesRulesListResult>() {})
    }

    /** Retrieve account points exchange */
    suspend fun accountPointsExchangesRetrieve(exchangeNo: String): AccountPointsExchangesRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/account/points/exchanges/${serializePathParameter(exchangeNo, PathParameterSpec("exchangeNo", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AccountPointsExchangesRetrieveResult>() {})
    }

    /** List account points history */
    suspend fun accountPointsHistoryList(page: Int? = null, pageSize: Int? = null, cursor: String? = null): AccountPointsHistoryListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/history"), query))
        return client.convertValue(raw, object : TypeReference<AccountPointsHistoryListResult>() {})
    }

    /** Create recharge */
    suspend fun accountPointsRechargesCreate(body: SubmitRechargeRequest, idempotencyKey: String, xRequestId: String? = null): AccountPointsRechargesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/account/points/recharges"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountPointsRechargesCreateResult>() {})
    }

    /** Retrieve account points recharge order */
    suspend fun accountPointsRechargesOrdersRetrieve(orderNo: String): AccountPointsRechargesOrdersRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/account/points/recharges/orders/${serializePathParameter(orderNo, PathParameterSpec("orderNo", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AccountPointsRechargesOrdersRetrieveResult>() {})
    }

    /** Cancel account points recharge order */
    suspend fun accountPointsRechargesOrdersCancel(orderNo: String, body: CommerceRechargeOrderCancelRequest, idempotencyKey: String, xRequestId: String? = null): AccountPointsRechargesOrdersCancelResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/account/points/recharges/orders/${serializePathParameter(orderNo, PathParameterSpec("orderNo", "simple", false))}/cancel"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountPointsRechargesOrdersCancelResult>() {})
    }

    /** List packages */
    suspend fun accountPointsRechargesPackagesList(): AccountPointsRechargesPackagesListResult? {
        val raw = client.get(ApiPaths.appPath("/billing/account/points/recharges/packages"))
        return client.convertValue(raw, object : TypeReference<AccountPointsRechargesPackagesListResult>() {})
    }

    /** List account points recharge records */
    suspend fun accountPointsRechargesRecordsList(page: Int? = null, pageSize: Int? = null, cursor: String? = null): AccountPointsRechargesRecordsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/account/points/recharges/records"), query))
        return client.convertValue(raw, object : TypeReference<AccountPointsRechargesRecordsListResult>() {})
    }

    /** Create account points transfer */
    suspend fun accountPointsTransfersCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = null): AccountPointsTransfersCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/account/points/transfers"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountPointsTransfersCreateResult>() {})
    }

    /** List account details */
    suspend fun accountSummaryRetrieve(): AccountSummaryRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/account/summary"))
        return client.convertValue(raw, object : TypeReference<AccountSummaryRetrieveResult>() {})
    }

    /** Retrieve account tokens */
    suspend fun accountTokensRetrieve(): AccountTokensRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/account/tokens"))
        return client.convertValue(raw, object : TypeReference<AccountTokensRetrieveResult>() {})
    }

    /** Create account token deduction */
    suspend fun accountTokensDeductionsCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = null): AccountTokensDeductionsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/account/tokens/deductions"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AccountTokensDeductionsCreateResult>() {})
    }

    /** List coupon catalog */
    suspend fun couponsCatalogList(status: String? = null, page: Int? = null, pageSize: Int? = null, cursor: String? = null): CouponsCatalogListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/coupons/catalog"), query))
        return client.convertValue(raw, object : TypeReference<CouponsCatalogListResult>() {})
    }

    /** Retrieve coupon catalog item */
    suspend fun couponsCatalogRetrieve(couponId: String): CouponsCatalogRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/coupons/catalog/${serializePathParameter(couponId, PathParameterSpec("couponId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CouponsCatalogRetrieveResult>() {})
    }

    /** Create coupon claim */
    suspend fun couponsClaimsCreate(body: CommerceCouponClaimRequest, idempotencyKey: String, xRequestId: String? = null): CouponsClaimsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/coupons/claims"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponsClaimsCreateResult>() {})
    }

    /** Redeem code */
    suspend fun couponsRedeemCreate(body: RedeemCodeRequest, idempotencyKey: String, xRequestId: String? = null): CouponsRedeemCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/coupons/redeem"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponsRedeemCreateResult>() {})
    }

    /** Create coupon usage */
    suspend fun couponsUsageCreate(body: CommerceCouponUsageRequest, idempotencyKey: String, xRequestId: String? = null): CouponsUsageCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/coupons/usage"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponsUsageCreateResult>() {})
    }

    /** Create coupon usage reversal */
    suspend fun couponsUsageReversalsCreate(body: CommerceCouponUsageRollbackRequest, idempotencyKey: String, xRequestId: String? = null): CouponsUsageReversalsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/coupons/usage_reversals"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CouponsUsageReversalsCreateResult>() {})
    }

    /** List checkout status */
    suspend fun paymentsCheckoutRetrieve(orderNo: String): PaymentsCheckoutRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/payments/checkout/${serializePathParameter(orderNo, PathParameterSpec("orderNo", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<PaymentsCheckoutRetrieveResult>() {})
    }

    /** List recharge history */
    suspend fun paymentsRecordsList(): PaymentsRecordsListResult? {
        val raw = client.get(ApiPaths.appPath("/billing/payments/records"))
        return client.convertValue(raw, object : TypeReference<PaymentsRecordsListResult>() {})
    }

    /** Retrieve payment record */
    suspend fun paymentsRecordsRetrieve(paymentId: String): PaymentsRecordsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/payments/records/${serializePathParameter(paymentId, PathParameterSpec("paymentId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<PaymentsRecordsRetrieveResult>() {})
    }

    /** Create preflight estimate */
    suspend fun preflightEstimatesCreate(body: CommercePreflightRequest): PreflightEstimatesCreateResult? {
        val raw = client.post(ApiPaths.appPath("/billing/preflight/estimates"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<PreflightEstimatesCreateResult>() {})
    }

    /** Create preflight precheck */
    suspend fun preflightPrechecksCreate(body: CommercePreflightRequest): PreflightPrechecksCreateResult? {
        val raw = client.post(ApiPaths.appPath("/billing/preflight/prechecks"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<PreflightPrechecksCreateResult>() {})
    }

    /** Create preflight prehold */
    suspend fun preflightPreholdsCreate(body: CommercePreflightRequest, idempotencyKey: String, xRequestId: String? = null): PreflightPreholdsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/preflight/preholds"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PreflightPreholdsCreateResult>() {})
    }

    /** Create preflight release */
    suspend fun preflightReleasesCreate(body: CommercePreflightRequest, idempotencyKey: String, xRequestId: String? = null): PreflightReleasesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/preflight/releases"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PreflightReleasesCreateResult>() {})
    }

    /** Create preflight settlement */
    suspend fun preflightSettlementsCreate(body: CommercePreflightRequest, idempotencyKey: String, xRequestId: String? = null): PreflightSettlementsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/preflight/settlements"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PreflightSettlementsCreateResult>() {})
    }

    /** List dashboard data */
    suspend fun settlementsDashboardList(year: Int? = null): SettlementsDashboardListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("year", year, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/settlements/dashboard"), query))
        return client.convertValue(raw, object : TypeReference<SettlementsDashboardListResult>() {})
    }

    /** List redeem history */
    suspend fun usersCurrentCouponsList(): UsersCurrentCouponsListResult? {
        val raw = client.get(ApiPaths.appPath("/billing/users/current/coupons"))
        return client.convertValue(raw, object : TypeReference<UsersCurrentCouponsListResult>() {})
    }

    /** Retrieve current user coupon */
    suspend fun usersCurrentCouponsRetrieve(userCouponId: String): UsersCurrentCouponsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/users/current/coupons/${serializePathParameter(userCouponId, PathParameterSpec("userCouponId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<UsersCurrentCouponsRetrieveResult>() {})
    }

    /** List wallet accounts */
    suspend fun walletAccountsList(assetType: String? = null): WalletAccountsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("asset_type", assetType, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/wallet/accounts"), query))
        return client.convertValue(raw, object : TypeReference<WalletAccountsListResult>() {})
    }

    /** Create wallet exchange */
    suspend fun walletExchangesCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = null): WalletExchangesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/wallet/exchanges"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<WalletExchangesCreateResult>() {})
    }

    /** Retrieve wallet operation */
    suspend fun walletOperationsRetrieve(requestNo: String): WalletOperationsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/wallet/operations/${serializePathParameter(requestNo, PathParameterSpec("requestNo", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<WalletOperationsRetrieveResult>() {})
    }

    /** Retrieve wallet overview */
    suspend fun walletOverviewRetrieve(): WalletOverviewRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/wallet/overview"))
        return client.convertValue(raw, object : TypeReference<WalletOverviewRetrieveResult>() {})
    }

    /** Create wallet topup */
    suspend fun walletTopupsCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = null): WalletTopupsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/wallet/topups"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<WalletTopupsCreateResult>() {})
    }

    /** List wallet transactions */
    suspend fun walletTransactionsList(page: Int? = null, pageSize: Int? = null, cursor: String? = null): WalletTransactionsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/wallet/transactions"), query))
        return client.convertValue(raw, object : TypeReference<WalletTransactionsListResult>() {})
    }

    /** Retrieve wallet transaction */
    suspend fun walletTransactionsRetrieve(transactionId: String): WalletTransactionsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/billing/wallet/transactions/${serializePathParameter(transactionId, PathParameterSpec("transactionId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<WalletTransactionsRetrieveResult>() {})
    }

    /** Create wallet transfer */
    suspend fun walletTransfersCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = null): WalletTransfersCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/wallet/transfers"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<WalletTransfersCreateResult>() {})
    }

    /** Create wallet withdrawal */
    suspend fun walletWithdrawalsCreate(body: CommerceWalletCommandRequest, idempotencyKey: String, xRequestId: String? = null): WalletWithdrawalsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/billing/wallet/withdrawals"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<WalletWithdrawalsCreateResult>() {})
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
