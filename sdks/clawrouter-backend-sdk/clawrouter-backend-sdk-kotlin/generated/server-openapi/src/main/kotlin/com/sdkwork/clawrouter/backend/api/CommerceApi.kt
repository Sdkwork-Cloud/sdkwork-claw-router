package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class CommerceApi(private val client: HttpClient) {

    /** List category attribute bindings */
    suspend fun catalogCategoryAttributesList(categoryId: String? = null, attributeId: String? = null, status: String? = null, page: String? = null, pageSize: String? = null): CatalogCategoryAttributesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            QueryParameterSpec("attribute_id", attributeId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/catalog/category_attributes"), query))
        return client.convertValue(raw, object : TypeReference<CatalogCategoryAttributesListResult>() {})
    }

    /** Create category attribute binding */
    suspend fun catalogCategoryAttributesCreate(body: CommerceProductCategoryAttributeMutationRequest, idempotencyKey: String): CatalogCategoryAttributesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/catalog/category_attributes"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CatalogCategoryAttributesCreateResult>() {})
    }

    /** Delete category attribute binding */
    suspend fun catalogCategoryAttributesDelete(bindingId: String): CatalogCategoryAttributesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/catalog/category_attributes/${serializePathParameter(bindingId, PathParameterSpec("bindingId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CatalogCategoryAttributesDeleteResult>() {})
    }

    /** Update category attribute binding */
    suspend fun catalogCategoryAttributesUpdate(bindingId: String, body: CommerceProductCategoryAttributeMutationRequest, idempotencyKey: String): CatalogCategoryAttributesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/catalog/category_attributes/${serializePathParameter(bindingId, PathParameterSpec("bindingId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CatalogCategoryAttributesUpdateResult>() {})
    }

    /** Initialize admin category seed datasets */
    suspend fun catalogCategorySeedsCreate(body: CommerceCategorySeedInitializeRequest, idempotencyKey: String): CatalogCategorySeedsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/catalog/category_seeds/initialize"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CatalogCategorySeedsCreateResult>() {})
    }

    /** Delete product SPU */
    suspend fun catalogProductsDelete(productId: String): CatalogProductsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/catalog/products/${serializePathParameter(productId, PathParameterSpec("productId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CatalogProductsDeleteResult>() {})
    }

    /** Delete product SKU */
    suspend fun catalogSkusDelete(skuId: String): CatalogSkusDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/catalog/skus/${serializePathParameter(skuId, PathParameterSpec("skuId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CatalogSkusDeleteResult>() {})
    }

    /** Update inventory stock */
    suspend fun inventoryStocksUpdate(stockId: String, body: CommerceInventoryStockUpdateRequest, idempotencyKey: String): InventoryStocksUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/inventory/stocks/${serializePathParameter(stockId, PathParameterSpec("stockId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<InventoryStocksUpdateResult>() {})
    }

    /** Memberships Members Status Update */
    suspend fun membershipsMembersStatusUpdate(membershipId: String, body: CommerceMembershipMemberStatusRequest, idempotencyKey: String): MembershipsMembersStatusUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/memberships/members/${serializePathParameter(membershipId, PathParameterSpec("membershipId", "simple", false))}/status"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsMembersStatusUpdateResult>() {})
    }

    /** Memberships Package Groups Update */
    suspend fun membershipsPackageGroupsUpdate(packageGroupId: String, body: CommerceMembershipPackageGroupMutationRequest, idempotencyKey: String): MembershipsPackageGroupsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/memberships/package_groups/${serializePathParameter(packageGroupId, PathParameterSpec("packageGroupId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsUpdateResult>() {})
    }

    /** Memberships Packages Update */
    suspend fun membershipsPackagesUpdate(packageId: String, body: CommerceMembershipPackageMutationRequest, idempotencyKey: String): MembershipsPackagesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/memberships/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPackagesUpdateResult>() {})
    }

    /** Memberships Plans Update */
    suspend fun membershipsPlansUpdate(planId: String, body: CommerceMembershipPlanMutationRequest, idempotencyKey: String): MembershipsPlansUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/memberships/plans/${serializePathParameter(planId, PathParameterSpec("planId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPlansUpdateResult>() {})
    }

    /** Orders Retrieve */
    suspend fun ordersRetrieve(orderId: String): OrdersRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/orders/${serializePathParameter(orderId, PathParameterSpec("orderId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<OrdersRetrieveResult>() {})
    }

    /** Payments Provider Accounts Delete */
    suspend fun paymentsProviderAccountsDelete(providerAccountId: String): PaymentsProviderAccountsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/payments/provider_accounts/${serializePathParameter(providerAccountId, PathParameterSpec("providerAccountId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<PaymentsProviderAccountsDeleteResult>() {})
    }

    /** Payments Provider Accounts Status Update */
    suspend fun paymentsProviderAccountsStatusUpdate(providerAccountId: String, body: CommercePaymentProviderAccountStatusUpdateRequest, idempotencyKey: String): PaymentsProviderAccountsStatusUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/payments/provider_accounts/${serializePathParameter(providerAccountId, PathParameterSpec("providerAccountId", "simple", false))}/status"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PaymentsProviderAccountsStatusUpdateResult>() {})
    }

    /** Payments Providers List */
    suspend fun paymentsProvidersList(page: String? = null, pageSize: String? = null, status: String? = null): PaymentsProvidersListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/providers"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsProvidersListResult>() {})
    }

    /** Payments Runtime Snapshot Retrieve */
    suspend fun paymentsRuntimeSnapshotRetrieve(environment: String? = null): PaymentsRuntimeSnapshotRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("environment", environment, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/payments/runtime/snapshot"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsRuntimeSnapshotRetrieveResult>() {})
    }

    /** Recharges Packages Delete */
    suspend fun rechargesPackagesDelete(packageId: String): RechargesPackagesDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/recharges/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RechargesPackagesDeleteResult>() {})
    }

    /** Recharges Settings Retrieve */
    suspend fun rechargesSettingsRetrieve(): RechargesSettingsRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/recharges/settings"))
        return client.convertValue(raw, object : TypeReference<RechargesSettingsRetrieveResult>() {})
    }

    /** Recharges Settings Update */
    suspend fun rechargesSettingsUpdate(body: CommerceRechargeSettingsUpdateRequest): RechargesSettingsUpdateResult? {
        val raw = client.put(ApiPaths.backendPath("/recharges/settings"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<RechargesSettingsUpdateResult>() {})
    }

    /** Shipments Tracking Events List */
    suspend fun shipmentsTrackingEventsList(shipmentId: String, page: String? = null, pageSize: String? = null, status: String? = null): ShipmentsTrackingEventsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/shipments/${serializePathParameter(shipmentId, PathParameterSpec("shipmentId", "simple", false))}/tracking_events"), query))
        return client.convertValue(raw, object : TypeReference<ShipmentsTrackingEventsListResult>() {})
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
