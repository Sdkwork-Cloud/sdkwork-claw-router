package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class CommerceApi(private val client: HttpClient) {

    /** Accounts Current Summary Retrieve */
    suspend fun accountsCurrentSummaryRetrieve(): AccountsCurrentSummaryRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/accounts/current/summary"))
        return client.convertValue(raw, object : TypeReference<AccountsCurrentSummaryRetrieveResult>() {})
    }

    /** Addresses List */
    suspend fun addressesList(page: Int? = null, pageSize: Int? = null, status: String? = null): AddressesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/addresses"), query))
        return client.convertValue(raw, object : TypeReference<AddressesListResult>() {})
    }

    /** Addresses Create */
    suspend fun addressesCreate(body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): AddressesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/addresses"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AddressesCreateResult>() {})
    }

    /** Addresses Delete */
    suspend fun addressesDelete(addressId: String, idempotencyKey: String, xRequestId: String? = null): AddressesDeleteResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.delete(ApiPaths.appPath("/addresses/${serializePathParameter(addressId, PathParameterSpec("addressId", "simple", false))}"), null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<AddressesDeleteResult>() {})
    }

    /** Addresses Update */
    suspend fun addressesUpdate(addressId: String, body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): AddressesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.appPath("/addresses/${serializePathParameter(addressId, PathParameterSpec("addressId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AddressesUpdateResult>() {})
    }

    /** Addresses Default Selection Create */
    suspend fun addressesDefaultSelectionCreate(addressId: String, body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): AddressesDefaultSelectionCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/addresses/${serializePathParameter(addressId, PathParameterSpec("addressId", "simple", false))}/default_selection"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AddressesDefaultSelectionCreateResult>() {})
    }

    /** Billing History List */
    suspend fun billingHistoryList(page: Int? = null, pageSize: Int? = null, type: String? = null, status: String? = null): BillingHistoryListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("type", type, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/billing/history"), query))
        return client.convertValue(raw, object : TypeReference<BillingHistoryListResult>() {})
    }

    /** Cart Current Retrieve */
    suspend fun cartCurrentRetrieve(): CartCurrentRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/cart/current"))
        return client.convertValue(raw, object : TypeReference<CartCurrentRetrieveResult>() {})
    }

    /** Cart Items Create */
    suspend fun cartItemsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): CartItemsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/cart/items"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CartItemsCreateResult>() {})
    }

    /** Cart Items Delete */
    suspend fun cartItemsDelete(cartItemId: String, idempotencyKey: String, xRequestId: String? = null): CartItemsDeleteResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.delete(ApiPaths.appPath("/cart/items/${serializePathParameter(cartItemId, PathParameterSpec("cartItemId", "simple", false))}"), null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<CartItemsDeleteResult>() {})
    }

    /** Cart Items Update */
    suspend fun cartItemsUpdate(cartItemId: String, body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): CartItemsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.appPath("/cart/items/${serializePathParameter(cartItemId, PathParameterSpec("cartItemId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CartItemsUpdateResult>() {})
    }

    /** List visible product categories */
    suspend fun catalogCategoriesList(parentId: String? = null, status: String? = null, page: Int? = null, pageSize: Int? = null): CatalogCategoriesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("parent_id", parentId, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/catalog/categories"), query))
        return client.convertValue(raw, object : TypeReference<CatalogCategoriesListResult>() {})
    }

    /** List visible catalog products */
    suspend fun catalogProductsList(q: String? = null, categoryId: String? = null, productType: String? = null, status: String? = null, page: Int? = null, pageSize: Int? = null, sort: String? = null): CatalogProductsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("category_id", categoryId, "form", true, false, null),
            QueryParameterSpec("product_type", productType, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("sort", sort, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/catalog/products"), query))
        return client.convertValue(raw, object : TypeReference<CatalogProductsListResult>() {})
    }

    /** Retrieve catalog product detail */
    suspend fun catalogProductsRetrieve(productId: String): CatalogProductsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/catalog/products/${serializePathParameter(productId, PathParameterSpec("productId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CatalogProductsRetrieveResult>() {})
    }

    /** Retrieve catalog SKU detail */
    suspend fun catalogSkusRetrieve(skuId: String): CatalogSkusRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/catalog/skus/${serializePathParameter(skuId, PathParameterSpec("skuId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CatalogSkusRetrieveResult>() {})
    }

    /** Checkout Sessions Create */
    suspend fun checkoutSessionsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): CheckoutSessionsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/checkout/sessions"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CheckoutSessionsCreateResult>() {})
    }

    /** Checkout Sessions Retrieve */
    suspend fun checkoutSessionsRetrieve(checkoutSessionId: String): CheckoutSessionsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/checkout/sessions/${serializePathParameter(checkoutSessionId, PathParameterSpec("checkoutSessionId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CheckoutSessionsRetrieveResult>() {})
    }

    /** Checkout Sessions Orders Create */
    suspend fun checkoutSessionsOrdersCreate(checkoutSessionId: String, body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): CheckoutSessionsOrdersCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/checkout/sessions/${serializePathParameter(checkoutSessionId, PathParameterSpec("checkoutSessionId", "simple", false))}/orders"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CheckoutSessionsOrdersCreateResult>() {})
    }

    /** Checkout Sessions Quotes Create */
    suspend fun checkoutSessionsQuotesCreate(checkoutSessionId: String, body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): CheckoutSessionsQuotesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/checkout/sessions/${serializePathParameter(checkoutSessionId, PathParameterSpec("checkoutSessionId", "simple", false))}/quotes"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CheckoutSessionsQuotesCreateResult>() {})
    }

    /** Fulfillments List */
    suspend fun fulfillmentsList(page: Int? = null, pageSize: Int? = null, status: String? = null): FulfillmentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/fulfillments"), query))
        return client.convertValue(raw, object : TypeReference<FulfillmentsListResult>() {})
    }

    /** Fulfillments Retrieve */
    suspend fun fulfillmentsRetrieve(fulfillmentId: String): FulfillmentsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/fulfillments/${serializePathParameter(fulfillmentId, PathParameterSpec("fulfillmentId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<FulfillmentsRetrieveResult>() {})
    }

    /** Invoices List */
    suspend fun invoicesList(page: Int? = null, pageSize: Int? = null, status: String? = null): InvoicesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/invoices"), query))
        return client.convertValue(raw, object : TypeReference<InvoicesListResult>() {})
    }

    /** Invoices Create */
    suspend fun invoicesCreate(body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): InvoicesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/invoices"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<InvoicesCreateResult>() {})
    }

    /** Invoices Retrieve */
    suspend fun invoicesRetrieve(invoiceId: String): InvoicesRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/invoices/${serializePathParameter(invoiceId, PathParameterSpec("invoiceId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<InvoicesRetrieveResult>() {})
    }

    /** Memberships Benefits List */
    suspend fun membershipsBenefitsList(planId: Int? = null): MembershipsBenefitsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("plan_id", planId, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/benefits"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsBenefitsListResult>() {})
    }

    /** Memberships Current Retrieve */
    suspend fun membershipsCurrentRetrieve(): MembershipsCurrentRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/current"))
        return client.convertValue(raw, object : TypeReference<MembershipsCurrentRetrieveResult>() {})
    }

    /** Memberships Current Status Retrieve */
    suspend fun membershipsCurrentStatusRetrieve(): MembershipsCurrentStatusRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/current/status"))
        return client.convertValue(raw, object : TypeReference<MembershipsCurrentStatusRetrieveResult>() {})
    }

    /** Memberships Package Groups List */
    suspend fun getMembershipsPackageGroupsList(planId: Int? = null, recommendedOnly: Boolean? = null): MembershipsPackageGroupsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("plan_id", planId, "form", true, false, null),
            QueryParameterSpec("recommended_only", recommendedOnly, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/package_groups"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsListResult>() {})
    }

    /** Memberships Package Groups Retrieve */
    suspend fun membershipsPackageGroupsRetrieve(packageGroupId: String): MembershipsPackageGroupsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/package_groups/${serializePathParameter(packageGroupId, PathParameterSpec("packageGroupId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsRetrieveResult>() {})
    }

    /** Memberships Package Groups Packages List */
    suspend fun getMembershipsPackageGroupsListPackageGroups(packageGroupId: String, planId: Int? = null): MembershipsPackageGroupsPackagesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("plan_id", planId, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/package_groups/${serializePathParameter(packageGroupId, PathParameterSpec("packageGroupId", "simple", false))}/packages"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsPackageGroupsPackagesListResult>() {})
    }

    /** Memberships Packages List */
    suspend fun membershipsPackagesList(page: Int? = null, pageSize: Int? = null, status: String? = null): MembershipsPackagesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/packages"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsPackagesListResult>() {})
    }

    /** Memberships Packages Retrieve */
    suspend fun membershipsPackagesRetrieve(packageId: String): MembershipsPackagesRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/packages/${serializePathParameter(packageId, PathParameterSpec("packageId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<MembershipsPackagesRetrieveResult>() {})
    }

    /** Memberships Plans List */
    suspend fun membershipsPlansList(): MembershipsPlansListResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/plans"))
        return client.convertValue(raw, object : TypeReference<MembershipsPlansListResult>() {})
    }

    /** Memberships Points Balance Retrieve */
    suspend fun membershipsPointsBalanceRetrieve(): MembershipsPointsBalanceRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/points/balance"))
        return client.convertValue(raw, object : TypeReference<MembershipsPointsBalanceRetrieveResult>() {})
    }

    /** Memberships Points Daily Rewards Create */
    suspend fun membershipsPointsDailyRewardsCreate(body: MembershipsPointsDailyRewardsCreateRequest? = null, xRequestId: String? = null): MembershipsPointsDailyRewardsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/memberships/points/daily_rewards"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPointsDailyRewardsCreateResult>() {})
    }

    /** Memberships Points Daily Rewards Status Retrieve */
    suspend fun membershipsPointsDailyRewardsStatusRetrieve(): MembershipsPointsDailyRewardsStatusRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/points/daily_rewards/status"))
        return client.convertValue(raw, object : TypeReference<MembershipsPointsDailyRewardsStatusRetrieveResult>() {})
    }

    /** Memberships Points History List */
    suspend fun membershipsPointsHistoryList(page: Int? = null, pageSize: Int? = null, cursor: String? = null): MembershipsPointsHistoryListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("cursor", cursor, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/memberships/points/history"), query))
        return client.convertValue(raw, object : TypeReference<MembershipsPointsHistoryListResult>() {})
    }

    /** Memberships Privileges Speed Ups Create */
    suspend fun membershipsPrivilegesSpeedUpsCreate(body: MembershipsPrivilegesSpeedUpsCreateRequest? = null, xRequestId: String? = null): MembershipsPrivilegesSpeedUpsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/memberships/privileges/speed_ups"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPrivilegesSpeedUpsCreateResult>() {})
    }

    /** Memberships Privileges Usage Retrieve */
    suspend fun membershipsPrivilegesUsageRetrieve(): MembershipsPrivilegesUsageRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/memberships/privileges/usage"))
        return client.convertValue(raw, object : TypeReference<MembershipsPrivilegesUsageRetrieveResult>() {})
    }

    /** Memberships Purchases Create */
    suspend fun membershipsPurchasesCreate(body: CommerceMembershipPurchaseRequest, idempotencyKey: String, xRequestId: String? = null): MembershipsPurchasesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/memberships/purchases"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPurchasesCreateResult>() {})
    }

    /** Memberships Purchases Renew */
    suspend fun membershipsPurchasesRenew(body: CommerceMembershipPurchaseRequest, idempotencyKey: String, xRequestId: String? = null): MembershipsPurchasesRenewResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/memberships/purchases/renew"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPurchasesRenewResult>() {})
    }

    /** Memberships Purchases Upgrade */
    suspend fun membershipsPurchasesUpgrade(body: CommerceMembershipPurchaseRequest, idempotencyKey: String, xRequestId: String? = null): MembershipsPurchasesUpgradeResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/memberships/purchases/upgrade"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<MembershipsPurchasesUpgradeResult>() {})
    }

    /** Orders List */
    suspend fun ordersList(page: Int? = null, pageSize: Int? = null, status: String? = null): OrdersListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/orders"), query))
        return client.convertValue(raw, object : TypeReference<OrdersListResult>() {})
    }

    /** Orders Retrieve */
    suspend fun ordersRetrieve(orderId: String): OrdersRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/orders/${serializePathParameter(orderId, PathParameterSpec("orderId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<OrdersRetrieveResult>() {})
    }

    /** Orders Cancellations Create */
    suspend fun ordersCancellationsCreate(orderId: String, body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): OrdersCancellationsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/orders/${serializePathParameter(orderId, PathParameterSpec("orderId", "simple", false))}/cancellations"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<OrdersCancellationsCreateResult>() {})
    }

    /** Orders Events List */
    suspend fun ordersEventsList(orderId: String, page: Int? = null, pageSize: Int? = null, status: String? = null): OrdersEventsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/orders/${serializePathParameter(orderId, PathParameterSpec("orderId", "simple", false))}/events"), query))
        return client.convertValue(raw, object : TypeReference<OrdersEventsListResult>() {})
    }

    /** Payments Attempts Retrieve */
    suspend fun paymentsAttemptsRetrieve(paymentAttemptId: String): PaymentsAttemptsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/payments/attempts/${serializePathParameter(paymentAttemptId, PathParameterSpec("paymentAttemptId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<PaymentsAttemptsRetrieveResult>() {})
    }

    /** Payments Intents Create */
    suspend fun paymentsIntentsCreate(body: CommercePaymentIntentCreateRequest, idempotencyKey: String, xRequestId: String? = null): PaymentsIntentsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/payments/intents"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PaymentsIntentsCreateResult>() {})
    }

    /** Payments Intents Retrieve */
    suspend fun paymentsIntentsRetrieve(paymentIntentId: String): PaymentsIntentsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/payments/intents/${serializePathParameter(paymentIntentId, PathParameterSpec("paymentIntentId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<PaymentsIntentsRetrieveResult>() {})
    }

    /** Payments Intents Attempts Create */
    suspend fun paymentsIntentsAttemptsCreate(paymentIntentId: String, body: CommercePaymentAttemptCreateRequest, idempotencyKey: String, xRequestId: String? = null): PaymentsIntentsAttemptsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/payments/intents/${serializePathParameter(paymentIntentId, PathParameterSpec("paymentIntentId", "simple", false))}/attempts"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<PaymentsIntentsAttemptsCreateResult>() {})
    }

    /** Payments Methods List */
    suspend fun paymentsMethodsList(page: Int? = null, pageSize: Int? = null, status: String? = null): PaymentsMethodsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/payments/methods"), query))
        return client.convertValue(raw, object : TypeReference<PaymentsMethodsListResult>() {})
    }

    /** Recharges Orders Create */
    suspend fun rechargesOrdersCreate(body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): RechargesOrdersCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/recharges/orders"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RechargesOrdersCreateResult>() {})
    }

    /** Recharges Orders Retrieve */
    suspend fun rechargesOrdersRetrieve(orderId: String): RechargesOrdersRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/recharges/orders/${serializePathParameter(orderId, PathParameterSpec("orderId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RechargesOrdersRetrieveResult>() {})
    }

    /** Recharges Packages List */
    suspend fun rechargesPackagesList(page: Int? = null, pageSize: Int? = null, status: String? = null): RechargesPackagesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/recharges/packages"), query))
        return client.convertValue(raw, object : TypeReference<RechargesPackagesListResult>() {})
    }

    /** Refunds List */
    suspend fun refundsList(page: Int? = null, pageSize: Int? = null, status: String? = null): RefundsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/refunds"), query))
        return client.convertValue(raw, object : TypeReference<RefundsListResult>() {})
    }

    /** Refunds Create */
    suspend fun refundsCreate(body: CommerceStandardCommandRequest, idempotencyKey: String, xRequestId: String? = null): RefundsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "Idempotency-Key" to HeaderParameterSpec(idempotencyKey, "simple", false, null),
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.appPath("/refunds"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<RefundsCreateResult>() {})
    }

    /** Refunds Retrieve */
    suspend fun refundsRetrieve(refundId: String): RefundsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/refunds/${serializePathParameter(refundId, PathParameterSpec("refundId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<RefundsRetrieveResult>() {})
    }

    /** Shipments Retrieve */
    suspend fun shipmentsRetrieve(shipmentId: String): ShipmentsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/shipments/${serializePathParameter(shipmentId, PathParameterSpec("shipmentId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<ShipmentsRetrieveResult>() {})
    }

    /** Wallet Accounts List */
    suspend fun walletAccountsList(page: Int? = null, pageSize: Int? = null, status: String? = null): WalletAccountsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/accounts"), query))
        return client.convertValue(raw, object : TypeReference<WalletAccountsListResult>() {})
    }

    /** Wallet Exchange Rate Retrieve */
    suspend fun walletExchangeRateRetrieve(): WalletExchangeRateRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/wallet/exchange_rate"))
        return client.convertValue(raw, object : TypeReference<WalletExchangeRateRetrieveResult>() {})
    }

    /** Wallet Ledger Entries List */
    suspend fun walletLedgerEntriesList(page: Int? = null, pageSize: Int? = null, status: String? = null): WalletLedgerEntriesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/ledger_entries"), query))
        return client.convertValue(raw, object : TypeReference<WalletLedgerEntriesListResult>() {})
    }

    /** Wallet Overview Retrieve */
    suspend fun walletOverviewRetrieve(): WalletOverviewRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/wallet/overview"))
        return client.convertValue(raw, object : TypeReference<WalletOverviewRetrieveResult>() {})
    }

    /** Wallet Points Exchange Rules List */
    suspend fun walletPointsExchangeRulesList(sourceAssetType: String? = null, targetAssetType: String? = null): WalletPointsExchangeRulesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("source_asset_type", sourceAssetType, "form", true, false, null),
            QueryParameterSpec("target_asset_type", targetAssetType, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/wallet/points/exchanges/rules"), query))
        return client.convertValue(raw, object : TypeReference<WalletPointsExchangeRulesListResult>() {})
    }

    /** Wallet Tokens Retrieve */
    suspend fun walletTokensRetrieve(): WalletTokensRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/wallet/tokens"))
        return client.convertValue(raw, object : TypeReference<WalletTokensRetrieveResult>() {})
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
